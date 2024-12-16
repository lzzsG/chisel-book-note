## 8 有限状态机 (Finite-State Machines, FSM)

有限状态机（FSM）是数字设计中最基础和重要的模块之一。FSM 通过**状态**（states）和**状态转移**（state transitions）描述系统的行为，适用于需要基于输入进行顺序控制的电路。

### **8.1 基本有限状态机 (Basic Finite-State Machine)**

#### **FSM 的组成部分**

一个 FSM 由以下三个主要部分组成：

1. **状态寄存器 (State Register)**：存储当前状态，通常用寄存器实现。
2. **下一个状态逻辑 (Next State Logic)**：通过组合逻辑计算出下一个状态。这个逻辑基于当前状态和输入信号决定状态转移。
3. **输出逻辑 (Output Logic)**：基于当前状态（或当前状态和输入信号）计算输出信号。

FSM 在每个时钟周期都会更新状态。**状态寄存器**在时钟的上升沿（或下降沿）将**下一个状态**存储为当前状态。

#### **FSM 的类型**

FSM 可以分为两种主要类型：

1. **Moore 机 (Moore Machine)**
   - **特点**：输出信号**仅**取决于当前状态，与输入信号无关。
   - **示意**：输出逻辑模块直接从状态寄存器获取当前状态来计算输出。
   - **优势**：输出更稳定，因为它不会立即受到输入变化的影响，只有状态变化时才会改变输出。
2. **Mealy 机 (Mealy Machine)**
   - **特点**：输出信号取决于**当前状态**和**输入信号**。
   - **示意**：输出逻辑模块同时考虑状态寄存器的当前状态和外部输入信号。
   - **优势**：输出响应更快，因为输出可以立即反映输入信号的变化。

### **FSM 的工作流程**

1. **初始状态**
   - FSM 在复位时进入一个预定义的**初始状态**。例如，警报系统可以从 `green` 状态开始。
2. **状态转移**
   - 基于当前状态和输入信号，FSM 根据**状态转移条件**决定下一时钟周期进入哪个状态。
   - 在时钟的上升沿，当前状态更新为下一个状态。
3. **输出计算**
   - **Moore 机**：输出只与当前状态有关。
   - **Mealy 机**：输出与当前状态和输入信号有关。

### **状态图与状态表**

FSM 的行为可以通过**状态图**（State Diagram）和**状态表**（State Table）来描述。

#### **状态图**

状态图是一种直观的方式，通过图形化的方法展示 FSM 的工作流程：

- **状态**：用带标签的圆圈表示，例如 `green`、`orange` 和 `red`。
- **状态转移**：用带箭头的连线表示，从一个状态到另一个状态的转移。
- **转移条件**：箭头上标注的条件，表示触发状态转移的输入信号或事件。

例如，**图 8.2** 展示了一个简单的警报系统 FSM：

- 初始状态为 `green`，表示正常状态。
- 如果接收到 `bad event` 输入，状态转移到 `orange`。
- 再次接收到 `bad event`，状态转移到 `red`，此时警报响起（`ring bell` 输出为高）。
- 如果接收到 `clear` 信号，状态可以从 `orange` 或 `red` 返回到 `green`。

#### **状态表**

状态表是一种更结构化的方式，列出 FSM 在不同状态下的行为：

- **当前状态**
- **输入信号**
- **下一个状态**
- **输出信号**

例如，对于三种状态 (`green`、`orange`、`red`) 和两种输入 (`bad event` 和 `clear`)，状态表可以描述所有可能的状态转移和输出。

### **总结**

1. **FSM 定义**：有限状态机通过**状态**和**状态转移**描述系统的行为，主要用于实现顺序逻辑电路。

2. FSM 类型 ：

   - **Moore 机**：输出仅取决于当前状态。
   - **Mealy 机**：输出取决于当前状态和输入信号。

3. 设计步骤 ：

   - 确定状态和状态转移条件。
   - 使用状态图或状态表描述 FSM 的行为。
   - 设计状态寄存器、下一个状态逻辑和输出逻辑。

4. **应用场景**：FSM 广泛用于控制电路、通信协议解析、数据流管理等场景。

通过状态图和状态表，可以清晰地理解和设计 FSM，为实现更复杂的控制逻辑打下基础。

## **Chisel 实现有限状态机 (FSM)**

本节展示了如何使用 **Chisel** 设计一个简单的有限状态机 (FSM)。示例是一个**警报系统 FSM**，其中 FSM 根据输入条件在不同的状态之间进行转换，并根据状态输出信号。

### **状态与状态编码**

在 Chisel 中，我们使用 `ChiselEnum` 类型来定义 FSM 的**状态**。

1. 状态定义
   - **状态枚举**：使用 `ChiselEnum` 定义所有可能的状态。
   - **初始状态**：通过 `RegInit` 设置 FSM 的初始状态。

```scala
object State extends ChiselEnum {
  val green, orange, red = Value  // 定义三个状态：green、orange 和 red
}
import State._

// 状态寄存器初始化为 green  
val stateReg = RegInit(green)
```

这里的状态包括：

- `green`：初始状态，表示系统正常。
- `orange`：表示警告状态。
- `red`：表示警报状态，触发警铃 (ring bell)。

### **状态转换逻辑 (Next State Logic)**

FSM 的**状态转换**逻辑基于当前状态和输入信号。

#### **输入信号**

在该示例中，FSM 有两个输入信号：

- `badEvent`：表示发生了异常事件。
- `clear`：表示清除警报信号。

#### **状态转换条件**

- **从 `green` 到 `orange`**：当接收到 `badEvent` 输入时。
- **从 `orange` 到 `red`**：再次接收到 `badEvent`。
- **从 `orange` 到 `green`**：接收到 `clear` 输入时。
- **从 `red` 到 `green`**：接收到 `clear` 输入时。

#### **Chisel 状态逻辑**

Chisel 使用 `switch` 和 `is` 控制结构来实现状态转换逻辑：

```scala
switch (stateReg) {
  is (green) {  
    when (io.badEvent) { stateReg := orange }  // 发生 badEvent，转到 orange 状态  
  }
  is (orange) {  
    when (io.badEvent) { stateReg := red }    // 再次发生 badEvent，转到 red 状态  
    .elsewhen (io.clear) { stateReg := green } // 发生 clear，返回 green 状态  
  }
  is (red) {  
    when (io.clear) { stateReg := green }     // 发生 clear，返回 green 状态  
  }
}
```

### **输出逻辑 (Output Logic)**

FSM 的输出取决于当前状态。在这个示例中：

- 当状态为 `red` 时，触发警铃输出 (`ringBell`) 为高电平。
- 输出逻辑是组合逻辑，不依赖于时钟。

```scala
io.ringBell := stateReg === red
```

### **状态表与状态图**

#### **状态表 (Table 8.1)**

状态表列出了 FSM 的所有行为，包括当前状态、输入信号、下一个状态和输出信号：

| **State** | **Bad Event** | **Clear** | **Next State** | **Ring Bell** |
| --------- | ------------- | --------- | -------------- | ------------- |
| `green`   | 0             | 0         | `green`        | 0             |
| `green`   | 1             | -         | `orange`       | 0             |
| `orange`  | 0             | 0         | `orange`       | 0             |
| `orange`  | 1             | -         | `red`          | 0             |
| `orange`  | 0             | 1         | `green`        | 0             |
| `red`     | 0             | 1         | `green`        | 1             |
| `red`     | 0             | 0         | `red`          | 1             |

#### **状态图 (Figure 8.2)**

状态图直观地展示了 FSM 的状态和状态之间的转移：

- **状态**：用圆圈表示，例如 `green`、`orange` 和 `red`。
- **状态转移**：通过带箭头的连线表示状态转换条件。

### **总结**

1. **状态定义**：使用 `ChiselEnum` 定义所有状态。
2. **状态寄存器**：用 `RegInit` 初始化状态寄存器为初始状态。
3. **状态转换逻辑**：使用 `switch` 和 `is` 语句，根据当前状态和输入信号确定下一个状态。
4. **输出逻辑**：基于当前状态计算输出信号。
5. **状态表与状态图**：状态表提供了结构化的描述，状态图提供了直观的可视化表示。

通过以上方法，可以轻松地在 Chisel 中设计一个有限状态机，并清晰地描述其行为。

下面是警报系统有限状态机（FSM）的完整 **Chisel** 代码，包括详细的注释，帮助理解 FSM 的每个组成部分和功能。

## **完整代码：警报系统 FSM**

```scala
import chisel3._
import chisel3.util._

// 顶层模块定义
class SimpleFsm extends Module {
  val io = IO(new Bundle {
    val badEvent = Input(Bool())  // 输入：badEvent 表示异常事件
    val clear    = Input(Bool())  // 输入：clear 表示清除警报
    val ringBell = Output(Bool()) // 输出：警报信号
  })

  // 1. 定义状态 (使用 ChiselEnum)
  object State extends ChiselEnum {
    val green, orange, red = Value  // 三个状态：green、orange 和 red
  }
  import State._  // 导入状态枚举

  // 2. 声明状态寄存器，并初始化为 "green" 状态
  val stateReg = RegInit(green)

  // 3. 状态转换逻辑 (Next State Logic)
  switch (stateReg) {
    is (green) {  // 当前状态：green
      when (io.badEvent) { 
        stateReg := orange  // 如果发生 badEvent，转到 orange 状态
      }
    }
    is (orange) {  // 当前状态：orange
      when (io.badEvent) { 
        stateReg := red     // 如果再次发生 badEvent，转到 red 状态
      }.elsewhen (io.clear) { 
        stateReg := green   // 如果接收到 clear 信号，返回 green 状态
      }
    }
    is (red) {  // 当前状态：red
      when (io.clear) { 
        stateReg := green   // 如果接收到 clear 信号，返回 green 状态
      }
    }
  }

  // 4. 输出逻辑
  // 警铃输出，当状态为 "red" 时，ringBell 输出为高电平
  io.ringBell := stateReg === red
}
```

## **代码详细注释和解释**

### **1. 模块和 IO 接口定义**

```scala
class SimpleFsm extends Module {
  val io = IO(new Bundle {
    val badEvent = Input(Bool())  // 输入信号：表示异常事件发生
    val clear    = Input(Bool())  // 输入信号：表示清除警报的指令
    val ringBell = Output(Bool()) // 输出信号：警铃状态，当状态为 red 时输出高电平
  })
}
```

- **模块名称**：`SimpleFsm` 是该有限状态机的名称。

- IO 接口 ：

  - **输入**：`badEvent` 和 `clear`，用于触发状态转换。
  - **输出**：`ringBell`，表示警铃状态。

### **2. 状态定义**

```scala
object State extends ChiselEnum {
  val green, orange, red = Value  // 定义三个状态：green、orange 和 red
}
import State._  // 导入定义的状态枚举
```

- `ChiselEnum` ：用于定义状态，

  ```
  green
  ```

  、

  ```
  orange
  ```

   和

  ```
  red
  ```

   代表三个状态：

  - **green**：正常状态。
  - **orange**：警告状态。
  - **red**：警报状态，触发警铃。

- 状态的好处 ：

  - 使用枚举类型提供更清晰的语义和可读性。
  - Chisel 会自动将状态映射为二进制编码。

### **3. 状态寄存器初始化**

```scala
val stateReg = RegInit(green)
```

- **`RegInit`**：创建一个寄存器并初始化为 `green` 状态。
- **状态寄存器**：用于存储 FSM 的当前状态，并在每个时钟周期根据状态转换逻辑更新。

### **4. 状态转换逻辑**

```scala
switch (stateReg) {
  is (green) {  
    when (io.badEvent) { stateReg := orange }  // green → orange
  }
  is (orange) {  
    when (io.badEvent) { stateReg := red }     // orange → red
    .elsewhen (io.clear) { stateReg := green } // orange → green
  }
  is (red) {  
    when (io.clear) { stateReg := green }      // red → green
  }
}
```

- **`switch` 语句**：根据当前状态 `stateReg` 执行不同的逻辑。

- 状态转换条件 ：

  - **green → orange**：当 `badEvent` 为高电平时。
  - **orange → red**：当再次接收到 `badEvent`。
  - **orange → green**：当接收到 `clear` 信号时。
  - **red → green**：当接收到 `clear` 信号时。

- **状态更新**：使用 `stateReg :=` 将下一个状态分配给状态寄存器。

### **5. 输出逻辑**

```scala
io.ringBell := stateReg === red
```

- **输出逻辑**：当状态为 `red` 时，警铃输出 `ringBell` 为高电平 (`true`)。
- **Moore 型输出**：输出仅取决于当前状态，不依赖输入信号。

## **运行示例行为**

| **当前状态** | **badEvent = 1** | **clear = 1** | **下一个状态** | **ringBell 输出** |
| ------------ | ---------------- | ------------- | -------------- | ----------------- |
| green        | 1                | 0             | orange         | 0                 |
| orange       | 1                | 0             | red            | 0                 |
| orange       | 0                | 1             | green          | 0                 |
| red          | 0                | 1             | green          | 1                 |

## **总结**

### **代码结构**

1. **输入/输出接口**：定义输入 `badEvent` 和 `clear`，输出 `ringBell`。
2. **状态定义**：使用 `ChiselEnum` 定义所有可能的状态。
3. **状态寄存器**：使用 `RegInit` 初始化状态寄存器。
4. **状态转换逻辑**：通过 `switch` 和 `when` 控制结构实现状态转移。
5. **输出逻辑**：基于当前状态计算输出信号。

### **优势**

- **模块化设计**：状态和逻辑分离，代码结构清晰。
- **状态可读性高**：`ChiselEnum` 提供易于理解的状态定义。
- **可扩展性**：可以轻松添加更多状态和转换逻辑。

### **应用场景**

这种 FSM 结构广泛用于：

- **控制系统**：例如电梯控制、交通灯系统。
- **通信协议解析**：例如 UART、SPI 等协议状态机。
- **警报系统**：如本示例中基于事件触发的警报控制。

通过该示例，可以深入理解如何在 Chisel 中实现一个功能完整的有限状态机！

## **8.2 具有更快输出的 Mealy FSM**

### **Moore FSM 与 Mealy FSM 的对比**

1. **Moore FSM**
   - 输出**仅**依赖于当前状态。
   - 输出的更新发生在时钟边沿，响应较慢，因为需要等待状态寄存器更新后才能决定输出。
2. **Mealy FSM**
   - 输出依赖于**当前状态**和**输入信号**。
   - 输出可以**立即**响应输入信号的变化，因此响应速度更快。
   - 组合逻辑直接将输入信号与当前状态结合，产生输出。

### **Mealy FSM 的特点**

- **输出路径**：在 Mealy FSM 中，输出逻辑同时考虑当前状态和输入信号，从而形成**组合逻辑路径**。
- **快速响应**：由于输出逻辑直接与输入信号相关，Mealy FSM 可以在同一个时钟周期内立即反映输入的变化。
- **更复杂的输出逻辑**：Mealy FSM 的输出依赖于组合逻辑，因此输出信号可能会随输入信号的瞬时变化而发生变化。

### **示例：边沿检测器 (Rising Edge Detector)**

#### **Moore FSM 实现**

- 在 Moore FSM 中，输出**仅依赖于状态**，因此只能在状态变化的下一个时钟周期输出有效信号。

- 状态图（

  图 8.6

  ）中：

  - **zero** 状态表示输入信号为 0。
  - 当输入信号从 0 变为 1 时，FSM 进入**one** 状态，输出产生高电平。
  - Moore 机的输出逻辑位于状态寄存器之后，更新输出需要等待时钟的下一个上升沿。

#### **Mealy FSM 实现**

- 在 Mealy FSM 中，输出取决于**当前状态**和**输入信号**，因此能够在输入信号变化的**同一个时钟周期**产生输出。

- 状态图（

  图 8.5

  ）中：

  - 状态 `zero` 表示当前输入为 0。
  - 当输入信号 `in` 从 0 变为 1 时，FSM 输出立即变为高电平，并同时切换到状态 `one`。
  - 在状态 `one` 中，当输入信号保持为 1，FSM 输出为 0，并保持在当前状态。

### **状态图解析**

**图 8.5** 和 **图 8.6** 展示了 Moore 和 Mealy FSM 实现边沿检测的状态图：

1. **Mealy FSM 状态图（图 8.5）**

   - 状态 `zero`

     ：输入为 0，输出为 0。

     - 输入变为 1 时，输出立即变为 1，并转移到状态 `one`。

   - 状态 `one`

     ：输入为 1，输出为 0。

     - 输入保持为 1，FSM 继续停留在状态 `one`。
     - 输入变为 0 时，FSM 返回状态 `zero`。

   - 状态转移的**箭头上标注的值**表示输入和输出信号：`输入/输出`。

2. **Moore FSM 状态图（图 8.6）**

   - 状态 `zero`

     ：输入为 0，输出为 0。

     - 输入变为 1 时，状态转移到状态 `puls`。

   - 状态 `puls`

     ：输出为 1，表示检测到上升沿。

     - 状态会立即转移到状态 `one`。

   - 状态 `one`

     ：输入为 1，输出为 0。

     - 输入变为 0 时，FSM 返回到状态 `zero`。

**差异总结**：

- 在 Mealy FSM 中，输出的变化与输入变化**同步**，不会延迟。
- 在 Moore FSM 中，输出的变化需要等待状态更新后才能反映出来。

### **代码解析**

**边沿检测器的 Chisel 实现 (Mealy FSM)**：

```scala
val risingEdge = din & !RegNext(din)
```

- 该实现展示了最小化的 Mealy FSM：
  - 当前输入 `din` 和前一时钟周期的 `din` 通过组合逻辑直接计算出**边沿检测输出**。
  - `RegNext` 表示一个时钟周期的延迟，用于保存输入的前一状态。
- 输出逻辑：
  - 当输入 `din` 为 1，且前一状态 `RegNext(din)` 为 0 时，输出 `risingEdge` 为 1。

**硬件资源消耗**：

- 该实现使用了一个触发器（`RegNext`）和简单的组合逻辑（AND 和 NOT）。
- 这种实现方式在硬件上与完整的 FSM 相比更加简洁高效。

### **总结**

1. **Moore FSM**：
   - 输出取决于当前状态。
   - 输出在时钟边沿更新，响应较慢。
2. **Mealy FSM**：
   - 输出取决于当前状态和输入信号。
   - 输出可以立即响应输入的变化，响应速度更快。
3. **边沿检测器示例**：
   - **Mealy FSM** 实现边沿检测器时，输出可以与输入变化同步，无需等待时钟边沿。
   - 简化实现：通过组合逻辑直接计算输出，减少硬件资源占用。
4. **应用场景**：
   - **Mealy FSM** 更适合需要快速响应输入的系统，例如边沿检测器、数据传输协议等。
   - **Moore FSM** 更适合输出需要稳定的系统，尤其是复杂的控制系统。

Mealy FSM 通过引入输入与状态的组合逻辑路径，提供了更快的输出响应，但设计时需要更细致地考虑输出与状态的关系，避免逻辑复杂度过高。

## **Mealy 型 FSM：上升沿检测器完整实现**

这段代码展示了如何用 **Chisel** 语言实现一个 **Mealy 型有限状态机 (FSM)**，用于检测输入信号 `din` 的**上升沿**。

### **代码解析**

#### **1. 顶层模块与 I/O 接口**

```scala
class RisingFsm extends Module {
  val io = IO(new Bundle {
    val din = Input(Bool())         // 输入信号：检测的输入
    val risingEdge = Output(Bool()) // 输出信号：检测到上升沿时为 true
  })
```

- **`din`**：输入信号，FSM 用来检测其上升沿。
- **`risingEdge`**：输出信号，当 `din` 从 0 跳变到 1 时输出 `true`。

#### **2. 状态定义与状态寄存器**

```scala
object State extends ChiselEnum {
  val zero, one = Value // 两个状态：zero 和 one
}
import State._

val stateReg = RegInit(zero) // 状态寄存器初始化为 zero
```

- 状态定义 ：

  - `zero`：表示输入 `din` 当前为低电平（0）。
  - `one`：表示输入 `din` 当前为高电平（1）。

- **状态寄存器**：`stateReg` 存储当前状态，使用 `RegInit` 将初始状态设为 `zero`。

#### **3. 输出逻辑与状态转移逻辑**

```scala
io.risingEdge := false.B  // 输出的默认值设为 false

switch (stateReg) {
  is (zero) {          // 当前状态为 zero
    when (io.din) {    // 检测到输入 din 为 1
      stateReg := one  // 状态转移到 one
      io.risingEdge := true.B  // 立即输出 risingEdge 为 true
    }
  }
  is (one) {           // 当前状态为 one
    when (!io.din) {   // 检测到输入 din 为 0
      stateReg := zero // 状态转移到 zero
    }
  }
}
```

- **状态 `zero`**：

  - **条件**：`io.din` 为高电平（1）。

  - 动作

    ：

    - 状态转移到 `one`。
    - 输出信号 `risingEdge` 立即设为 `true`，表示检测到了上升沿。

- **状态 `one`**：

  - **条件**：`io.din` 为低电平（0）。
  - **动作**：状态返回到 `zero`，等待下一个上升沿。

- **输出逻辑**：

  - `io.risingEdge` 的默认值为 `false`。
  - 只有当 `stateReg` 处于 `zero` 状态且 `din` 为高电平时，`risingEdge` 输出 `true`。

### **Mealy FSM 特点**

1. **输出依赖于输入和状态**：
   - 在状态 `zero` 时，如果 `din` 为高电平，立即输出 `risingEdge = true`。
   - 输出响应输入信号的变化，没有额外的时钟周期延迟。
2. **快速响应**：
   - 输出通过组合逻辑路径直接反映输入的变化。
3. **状态与输出分离**：
   - 状态寄存器用于保存当前状态，输出逻辑根据状态和输入信号动态计算。

### **状态图解析**

该 FSM 的状态图包括两个状态和相应的状态转移：

1. **状态 `zero` (输入为 0)**

   - 如果输入

     ```
     din = 1
     ```

     ，

     - 状态转移到 `one`，
     - 输出 `risingEdge = 1`。

2. **状态 `one` (输入为 1)**

   - 如果输入

     ```
     din = 0
     ```

     ，

     - 状态转移回 `zero`，
     - 输出 `risingEdge = 0`。

状态图对应的输入/输出关系：

- `zero` → `one`（输入 1/输出 1）
- `one` → `zero`（输入 0/输出 0）

### **总结**

1. **模块结构**
   - 输入信号：`din`。
   - 输出信号：`risingEdge`，表示上升沿检测结果。
   - 状态寄存器：保存当前 FSM 状态。
2. **工作原理**
   - 状态 `zero`：检测到输入为高电平，输出上升沿信号。
   - 状态 `one`：等待输入信号返回低电平，FSM 回到初始状态。
3. **Mealy 型 FSM 优势**
   - 输出可以立即响应输入的变化。
   - 在时序电路中，适合需要快速输出的场景，如**边沿检测**和**数据传输控制**等。

这段代码展示了一个简洁且高效的 Mealy 型 FSM 实现，适用于实时检测输入信号的上升沿。

## **8.3 Moore FSM 对比 Mealy FSM**

通过这个示例，我们可以深入理解 **Moore FSM** 和 **Mealy FSM** 之间的关键区别。以下是对 **Moore 型 FSM** 的实现和特点的详细解析。

### **Moore FSM：上升沿检测器**

**代码实现总结**

1. **状态增加**：与 Mealy FSM 的 2 个状态（`zero` 和 `one`）不同，Moore FSM 需要 3 个状态：
   - **zero**：表示输入信号 `din` 为 0。
   - **puls**：产生一个单时钟周期的脉冲信号。
   - **one**：表示输入信号 `din` 为 1，FSM 等待输入返回到 0。
2. **输出依赖于状态**：Moore FSM 的输出逻辑仅取决于当前状态，与输入信号无关。
   - 当 FSM 处于 `puls` 状态时，输出信号 `risingEdge` 为高电平。
3. **状态转移逻辑**：
   - 从 `zero` 到 `puls`：当检测到 `din` 为 1。
   - 从 `puls` 到 `one` 或返回到 `zero`：根据输入信号是否保持为 1。
   - 从 `one` 到 `zero`：当输入信号 `din` 返回到 0。

### **代码详解**

```scala
import chisel3._
import chisel3.util._

class RisingMooreFsm extends Module {
  val io = IO(new Bundle {
    val din = Input(Bool())         // 输入信号：检测的输入
    val risingEdge = Output(Bool()) // 输出信号：检测到上升沿时为 true
  })

  // 1. 定义状态
  object State extends ChiselEnum {
    val zero, puls, one = Value     // 三个状态：zero, puls 和 one
  }
  import State._

  // 2. 状态寄存器
  val stateReg = RegInit(zero)

  // 3. 状态转移逻辑
  switch (stateReg) {
    is (zero) {                  // 状态 zero：输入为 0
      when (io.din) {            // 输入变为 1
        stateReg := puls         // 转移到 puls 状态
      }
    }
    is (puls) {                  // 状态 puls：输出单周期脉冲
      when (io.din) {            // 输入仍为 1
        stateReg := one          // 转移到 one 状态
      } .otherwise {
        stateReg := zero         // 输入返回 0，转回 zero 状态
      }
    }
    is (one) {                   // 状态 one：输入为 1，等待输入变为 0
      when (!io.din) {           // 输入返回 0
        stateReg := zero         // 转回 zero 状态
      }
    }
  }

  // 4. 输出逻辑
  io.risingEdge := stateReg === puls  // 仅当状态为 puls 时，输出 risingEdge 为 true
}
```

### **状态图分析**

如 **图 8.6** 所示，Moore FSM 的状态图包含三个状态：

1. **zero**：表示 `din` 为 0 的状态。
   - 当 `din` 变为 1，状态转移到 `puls`。
2. **puls**：表示检测到上升沿的状态。
   - 输出信号 `risingEdge` 在这个状态下为高电平。
   - 如果输入 `din` 继续为 1，转移到 `one` 状态。
   - 如果输入 `din` 返回到 0，转回 `zero`。
3. **one**：表示输入 `din` 为 1，且上升沿已经被检测到。
   - 当 `din` 返回到 0，转回 `zero` 状态。

### **Moore FSM 与 Mealy FSM 对比**

| **特性**         | **Moore FSM**                          | **Mealy FSM**                            |
| ---------------- | -------------------------------------- | ---------------------------------------- |
| **输出依赖**     | 仅依赖于当前状态                       | 依赖于当前状态和输入信号                 |
| **输出延迟**     | 输出在状态转移后的下一个时钟周期更新   | 输出与输入信号的变化同步，响应更快       |
| **状态数量**     | 通常需要额外的状态来表示输出           | 状态数量较少，通常更简单                 |
| **输出稳定性**   | 输出更稳定，不会随输入的瞬时变化而抖动 | 输出可能随输入信号的瞬时变化而抖动       |
| **组合逻辑路径** | 仅在状态逻辑中，组合逻辑路径较短       | 输出逻辑包含输入信号，组合逻辑路径较长   |
| **适用场景**     | 更适合用于复杂设计或多 FSM 交互的系统  | 更适合对输入变化有快速响应需求的小型电路 |

### **波形比较 (Figure 8.7)**

1. **Mealy FSM**：
   - 输出信号 `risingEdge` **紧随输入信号 `din` 的上升沿**立即变为高电平。
   - 输出脉冲持续时间短，通常少于一个时钟周期。
2. **Moore FSM**：
   - 输出信号 `risingEdge` 在状态转移到 `puls` 后的**下一个时钟周期**变为高电平。
   - 输出脉冲持续**一个完整的时钟周期**。

### **设计权衡**

1. **Mealy FSM 的优点**：
   - 输出响应速度快，适用于对输入变化有实时要求的场景。
   - 状态数量较少，硬件资源消耗小。
2. **Moore FSM 的优点**：
   - 输出更稳定，与输入信号解耦，避免组合逻辑路径过长。
   - 适用于多个 FSM 互相通信的复杂系统，更易于调试和优化。

### **总结**

- **Moore FSM** 输出取决于状态，输出在时钟边沿更新，响应略慢但更稳定。
- **Mealy FSM** 输出取决于状态和输入，响应更快但更复杂。
- 在小型、单一功能的电路中（如上升沿检测器），Mealy FSM 更简洁高效。
- 在复杂系统或多个 FSM 交互中，Moore FSM 更安全可靠。

通过该示例，可以清晰地理解 Moore FSM 和 Mealy FSM 在设计、性能和实现上的区别，并根据实际应用需求做出合理选择。

## **8.4 练习：交通灯控制器 FSM 设计**

本练习要求设计一个稍微复杂的有限状态机 (**FSM**)：**交通灯控制器**。通过这个例子，可以综合应用之前学习的 Moore FSM 和 Mealy FSM 的知识，设计一个功能完善的状态机。以下是详细的设计思路和实现步骤：

### **问题描述**

1. **主要目标**
   - 控制两个方向的交通灯：主路 (**priority road**) 和次路 (**minor road**)。
   - 确保在从红灯切换到绿灯时，有一个**中间阶段**（黄色灯），使两个方向的灯同时处于红灯状态，确保安全。
2. **功能需求**
   - 主路始终具有优先权（默认绿灯状态）。
   - 只有当检测到次路有车时，才允许次路的灯切换到绿灯。
   - 次路的绿灯阶段结束后，灯重新切换回主路的绿灯。
3. **输入信号**
   - `carDetected`：检测到次路有车通过的信号。
   - `timer`：控制黄灯和绿灯的持续时间。
4. **输出信号**
   - 交通灯的状态：红灯、黄灯、绿灯。

### **状态定义**

使用 **Moore FSM** 设计该交通灯控制器，以下是可能的状态：

1. **主路绿灯 (PriorityGreen)**
   - 主路灯为绿灯，次路灯为红灯。
   - 如果 `carDetected` 为高电平，FSM 转换到黄灯阶段。
2. **主路黄灯 (PriorityYellow)**
   - 主路灯为黄灯，次路灯为红灯。
   - 在黄灯计时完成后，FSM 转换到次路绿灯阶段。
3. **次路绿灯 (MinorGreen)**
   - 主路灯为红灯，次路灯为绿灯。
   - 在绿灯计时完成后，FSM 转换到次路黄灯阶段。
4. **次路黄灯 (MinorYellow)**
   - 主路灯为红灯，次路灯为黄灯。
   - 在黄灯计时完成后，FSM 返回主路绿灯阶段。

### **状态图**

FSM 状态图如下：

- **主路绿灯** → **主路黄灯** → **次路绿灯** → **次路黄灯** → **主路绿灯**

- 条件 ：

  - 主路黄灯的切换由计时器控制。
  - 次路绿灯的切换由车检测信号 `carDetected` 控制。

### **状态转移逻辑**

- **主路绿灯** (PriorityGreen)：
  - 如果 `carDetected` 为高电平，进入**主路黄灯**。
- **主路黄灯** (PriorityYellow)：
  - 等待计时器 `timer` 完成，进入**次路绿灯**。
- **次路绿灯** (MinorGreen)：
  - 等待计时器 `timer` 完成，进入**次路黄灯**。
- **次路黄灯** (MinorYellow)：
  - 等待计时器 `timer` 完成，返回**主路绿灯**。

### **输出逻辑**

在 Moore FSM 中，输出仅取决于当前状态：

- **主路绿灯 (PriorityGreen)**：主路为绿灯，次路为红灯。
- **主路黄灯 (PriorityYellow)**：主路为黄灯，次路为红灯。
- **次路绿灯 (MinorGreen)**：主路为红灯，次路为绿灯。
- **次路黄灯 (MinorYellow)**：主路为红灯，次路为黄灯。

### **硬件实现步骤**

1. **状态定义**
    使用 `ChiselEnum` 定义 FSM 的状态：`PriorityGreen`、`PriorityYellow`、`MinorGreen` 和 `MinorYellow`。
2. **状态寄存器**
    用 `RegInit` 初始化 FSM 的状态为 `PriorityGreen`（主路绿灯）。
3. **状态转移逻辑**
    使用 `switch` 和 `is` 语句，根据当前状态和输入信号实现状态切换。
4. **输出逻辑**
    使用 `when` 和布尔条件为主路和次路的灯设置红、黄、绿状态。

### **测试步骤**

1. **生成测试输入**
   - 模拟 `carDetected` 信号：次路检测到车辆时为高电平。
   - 模拟 `timer` 信号：用于控制黄灯和绿灯的持续时间。
2. **验证输出**
   - 确保 FSM 按照预定状态图正确地进行状态切换。
   - 验证输出灯的状态与状态机的状态一致。
3. **边界情况测试**
   - 测试主路无车情况下的默认绿灯状态。
   - 测试多个连续 `carDetected` 信号的响应情况。

### **总结**

通过这个练习，可以进一步掌握 FSM 的设计、实现和验证过程。

- **Moore FSM**：状态逻辑简单，输出稳定。
- **状态转换**：根据输入信号和定时条件，设计合理的状态切换路径。
- **模块化设计**：将状态定义、状态转移逻辑和输出逻辑分离，结构清晰易维护。

下一步，可以基于此设计编写 Chisel 代码实现该交通灯控制器 FSM，并创建测试平台验证其功能和时序正确性。
