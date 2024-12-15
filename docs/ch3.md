# 3. **Build Process and Testing**

要编写更复杂的 Chisel 代码，必须掌握如何构建项目、生成 Verilog 代码、在 FPGA 上执行设计，以及编写测试来验证电路的正确性。本章介绍如何使用 **`sbt`** 构建 Chisel 项目、组织代码结构，以及导入和测试模块。

## 3.1 **使用 `sbt` 构建项目**

`sbt`（Scala Build Tool）是 Scala 的常用构建工具，支持项目自动化构建、依赖管理和代码测试。Chisel 项目使用 `sbt` 管理：

- 自动下载 **Chisel** 和 **Chisel 测试器** 的库。
- 管理项目依赖、代码编译和测试执行。

#### **配置 `build.sbt` 文件**

`build.sbt` 是项目的配置文件，包含 Chisel 库的引用：

```scala
libraryDependencies += "edu.berkeley.cs" %% "chisel3" % "latest.release"
```

- **`latest.release`**：指定下载 Chisel 的最新稳定版本。
- 依赖库会自动从 **Maven 仓库** 下载。

### **项目源代码组织结构**

`sbt` 默认使用 Maven 的目录结构，项目的文件树如下所示：

```
project
 └── src
      ├── main
      │    └── scala
      │         └── package
      │              └── sub-package
      ├── test
      │    └── scala
      │         └── package
      └── target
           └── generated
```

- **`src/main/scala`**：存放 Chisel 源代码（主要模块）。
- **`src/test/scala`**：存放测试代码。
- **`target/generated`**：存放生成的中间文件，如 Verilog 文件。

### **包（Package）和模块组织**

Chisel 项目源代码可以组织成不同的 **包（Package）**，便于管理和复用。包的定义与 Scala 一致。

#### **创建包并导入模块**

1. **定义包**：使用 `package` 关键字将模块归类到一个包内。

   ```scala
   package mypack
   
   import chisel3._
   
   class Abc extends Module {
     val io = IO(new Bundle {})
   }
   ```

2. **导入包中的模块**：

   - 导入整个包（使用 `_*` 通配符）：

     ```scala
     import mypack._
     
     class AbcUser extends Module {
       val io = IO(new Bundle {})
       val abc = new Abc() // 使用 Abc 模块
     }
     ```

   - 导入单个类：

     ```scala
     import mypack.Abc
     
     class AbcUser2 extends Module {
       val io = IO(new Bundle {})
       val abc = new Abc()
     }
     ```

   - 使用 **完全限定名** 导入模块：

     ```scala
     class AbcUser3 extends Module {
       val io = IO(new Bundle {})
       val abc = new mypack.Abc() // 使用完整路径
     }
     ```

### **测试模块**

Chisel 支持编写测试来验证电路逻辑，通常与 `src/test/scala` 中的测试代码结合使用。测试框架可以验证 Chisel 模块生成的行为是否正确，后续章节将深入介绍 Chisel 测试框架。



## 3.1.2 **运行 `sbt` 命令**

在 Chisel 项目中，可以通过简单的 `sbt` 命令来编译和执行代码。

### **运行项目**

执行以下命令，`sbt` 将会编译项目中的 Chisel 代码，并搜索包含 `main` 方法或继承 `App` 的对象：

```bash
sbt run
```

- 若项目中存在多个对象，`sbt` 将列出所有对象，用户可选择要执行的对象。
- 如果想直接指定某个对象，可以通过以下命令：

```bash
sbt "runMain mypacket.MyObject"
```

### **执行测试**

要运行基于 **ChiselTest** 编写的测试，只需执行以下命令：

```bash
sbt test
```

- 若测试代码未采用标准的 ChiselTest 风格（例如包含 `main` 方法），可以直接运行指定的测试对象：

```bash
sbt "test:runMain mypacket.MyMainTest"
```

## 3.1.3 **生成 Verilog 文件**

要将 Chisel 代码转换成 Verilog 文件，用于 FPGA 或 ASIC 综合，可以使用 `emitVerilog()` 函数。以下代码展示了如何生成 Verilog 文件：

### **基础示例**

```scala
object Hello extends App {
  emitVerilog(new Hello()) // 生成 Verilog 文件 Hello.v
}
```

- **`emitVerilog`**：将 Chisel 模块转换成 Verilog 代码。
- 默认情况下，生成的 Verilog 文件会输出到项目根目录。

### **指定目标目录**

可以通过额外参数指定生成文件的目录：

```scala
object HelloOption extends App {
  emitVerilog(new Hello(), Array("--target-dir", "generated")) // 输出到 generated 文件夹
}
```

- 上述代码会将 Verilog 文件输出到 `generated/Hello.v`。

### **生成 Verilog 代码字符串**

如果不想写入文件，而是将 Verilog 代码保存为字符串，可以使用以下代码：

```scala
object HelloString extends App {
  val s = getVerilogString(new Hello())
  println(s) // 输出 Verilog 字符串
}
```

这种方法非常适合在在线编译器（例如 **Scastie**）上展示简单的 Chisel 示例。

## 3.1.4 **工具流程（Tool Flow）**

Chisel 的工具链将高级硬件描述逐步转换成可综合的 Verilog 文件，并最终用于 FPGA/ASIC 综合。

### **完整工具流程**

1. **Chisel 源代码**：
   - 硬件设计用 Chisel 编写，例如 `Hello.scala`。
2. **Scala 编译器**：
   - 将 Chisel 代码编译成 Java 字节码（`Hello.class`），可运行在 Java 虚拟机（JVM）上。
3. **生成 FIRRTL**：
   - 运行 Chisel 驱动生成 FIRRTL 文件（**Flexible Intermediate Representation for RTL**），如 `Hello.fir`。
   - FIRRTL 是 Chisel 中间表示层，用于进一步优化和转换电路。
4. **FIRRTL 转换**：
   - FIRRTL 编译器对电路进行优化，并将其转换成 Verilog 文件（`Hello.v`）。
   - 可以使用 FPGA/ASIC 综合工具（如 **Intel Quartus**、**Xilinx Vivado**）将 Verilog 转换为可编程文件（例如 `Hello.bit`）。
5. **仿真与调试**：
   - 使用 **Treadle** 等模拟器运行 FIRRTL 文件，验证设计的行为。
   - 可以生成波形文件（如 **Hello.vcd**），通过 GTKWave 或 Modelsim 等工具进行波形查看。



## 扩展：`sbt`、FIRRTL、`mill` 和 CIRCT

在 Chisel 项目的工具链中，主要涉及到 `sbt` 和 **FIRRTL**，此外，`mill` 和 **CIRCT** 也提供了高效的工具支持，进一步丰富了 Chisel 的编译和综合流程。

### **1. `sbt` 构建工具**

`sbt`（Scala Build Tool）是 Chisel 最常用的构建工具，提供了以下功能：

- **依赖管理**：自动下载 Chisel 和 Scala 库。
- **代码编译**：将 Chisel 代码编译成可执行的 Scala 程序。
- **Verilog 生成**：通过 `emitVerilog()` 生成 Verilog 文件。
- **测试执行**：运行基于 ChiselTest 的测试代码。

**使用 `sbt` 命令示例**：

- 运行项目：

  ```bash
  sbt run
  ```

- 生成 Verilog 文件：

  ```scala
  emitVerilog(new Hello())
  ```

- 运行测试：

  ```bash
  sbt test
  ```

`sbt` 是 Chisel 官方推荐的工具，功能完善且成熟，适用于大部分项目开发和测试场景。

### **2. FIRRTL：中间表示与电路转换**

FIRRTL（**Flexible Intermediate Representation for RTL**）是 Chisel 代码生成的中间表示，主要功能包括：

- **电路优化**：进行中间电路优化，例如常量折叠、死代码消除等。
- **代码转换**：将 FIRRTL 转换成 Verilog，供 FPGA/ASIC 工具进行综合。
- **模拟与验证**：结合 Treadle 仿真器，可以直接运行 FIRRTL 文件，验证电路功能。

**FIRRTL 工作流程**：

1. Chisel 代码 → **FIRRTL 文件**（`Hello.fir`）。
2. FIRRTL 优化与转换 → **Verilog 文件**（`Hello.v`）。
3. Verilog → FPGA/ASIC 工具综合 → 可编程文件（`Hello.bit`）。

**示例**：

```bash
sbt "runMain mypack.Hello"
```

生成的 `Hello.fir` 会经过 FIRRTL 编译器，生成可综合的 Verilog。

### **3. `mill`：轻量级构建工具**

`mill` 是一个替代 `sbt` 的轻量级构建工具，具有更简单的配置和更快的构建速度。它可以用来管理 Chisel 项目，特别适合需要快速构建的小型项目。

#### **使用 `mill` 的优势**

- 更快的增量编译。
- 配置文件简洁，易于上手。

#### **`mill` 构建 Chisel 项目示例**

1. 在项目中创建

   ```
   build.sc
   ```

    文件，包含以下配置：

   ```scala
   import mill._
   import mill.scalalib._
   
   object hello extends ScalaModule {
     def scalaVersion = "2.13.10"
     def ivyDeps = Agg(
       ivy"edu.berkeley.cs::chisel3:latest.release"
     )
   }
   ```

2. 运行

   ```
   mill
   ```

    命令：

   - 编译项目：

     ```bash
     mill hello.compile
     ```

   - 运行主模块：

     ```bash
     mill hello.runMain mypack.Hello
     ```

`mill` 提供了轻量级构建体验，对于小型项目和简单应用非常高效。

### **4. CIRCT：下一代硬件编译框架**

CIRCT（**Circuit IR Compilers and Tools**）是 LLVM 项目的一部分，旨在为 Chisel 和其他硬件描述语言提供更高效的中间表示（IR）编译和转换工具。

#### **CIRCT 特点**

- **高性能**：通过现代编译技术优化硬件设计流程，提升电路生成和优化的效率。
- **支持多种硬件描述语言**：不仅支持 Chisel，还支持 FIRRTL 和其他中间表示。
- **替代 FIRRTL**：CIRCT 提供了 FIRRTL 的替代实现，能够生成更优化的 Verilog 和 RTL 代码。

#### **CIRCT 使用流程**

1. 使用 Chisel 生成 FIRRTL 文件：

   ```scala
   emitVerilog(new Hello()) // 输出 FIRRTL 和 Verilog 文件
   ```

2. 使用 CIRCT 对 FIRRTL 进行转换和优化，生成高效的 Verilog：

   ```bash
   firtool -format=fir -o Hello.v Hello.fir
   ```

   - **`firtool`** 是 CIRCT 提供的 FIRRTL 优化工具。

CIRCT 为 Chisel 提供了一个性能更强、更灵活的硬件编译工具链，特别适合复杂硬件设计和高性能应用。

### **工具总结与选择**

| **工具**   | **功能**                              | **适用场景**                    |
| ---- | - | - |
| **sbt**    | 构建、依赖管理、测试、生成 Verilog    | 大型项目，官方推荐工具          |
| **FIRRTL** | Chisel 中间表示、优化与 Verilog 生成  | 电路验证、综合和 FPGA/ASIC 流程 |
| **mill**   | 轻量级构建工具，替代 sbt              | 小型项目、快速原型开发          |
| **CIRCT**  | FIRRTL 的高性能替代工具，优化硬件生成 | 复杂设计、高性能硬件编译与优化  |

## 3.2 Testing with Chisel

## 3.2.1 ScalaTest

**ScalaTest** 是一个用于 Scala 和 Java 的强大单元测试工具。**ChiselTest** 是基于 **ScalaTest** 扩展而来的，专门用于验证 Chisel 电路设计。在深入了解 ChiselTest 之前，我们先看一个简单的 ScalaTest 示例，来理解它的基本用法。

### **1. 添加 ScalaTest 依赖**

在项目的 `build.sbt` 文件中添加以下依赖，以引入 ScalaTest 库：

```scala
libraryDependencies += "org.scalatest" %% "scalatest" % "3.1.4" % "test"
```

- **`org.scalatest`**：ScalaTest 的库名。
- **`3.1.4`**：指定版本号。
- **`% "test"`**：表示这个库仅用于测试环境。

### **2. 编写测试代码**

测试代码通常存放在 `src/test/scala` 目录下。下面是一个简单的测试示例，验证整数加法和乘法操作：

```scala
import org.scalatest._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class ExampleTest extends AnyFlatSpec with Matchers {
  "Integers" should "add" in {
    val i = 2
    val j = 3
    i + j should be (5) // 测试 i + j 的结果是否为 5
  }

  "Integers" should "multiply" in {
    val a = 3
    val b = 4
    a * b should be (12) // 测试 a * b 的结果是否为 12
  }
}
```

**解释**：

- **`AnyFlatSpec`**：一种测试风格，测试代码可读性强，类似执行文档。
- **`should` 语法**：用于描述测试预期。
- **`Matchers`**：提供直观的匹配语法，如 `should be (5)`。

### **3. 执行测试**

#### **运行所有测试**

在项目根目录运行以下命令，执行所有测试代码：

```bash
sbt test
```

#### **运行单个测试套件**

如果只想运行某个测试类（例如 `ExampleTest`），可以使用 `testOnly` 命令：

```bash
sbt "testOnly ExampleTest"
```

**注意**：

- 若测试类名拼写错误（例如 `Exampletest`），`sbt` 将输出一个简洁的错误提示：
   **"No tests were executed"**。

### **4. 测试输出结果**

执行测试时，`sbt` 会详细输出测试的执行状态和结果。例如：

```text
[info] ExampleTest:
[info] Integers
[info] - should add
[info] Integers
[info] - should multiply
[info] ScalaTest
[info] Run completed in 119 milliseconds.
[info] Total number of tests run: 2
[info] Suites: completed 1, aborted 0
[info] Tests: succeeded 2, failed 0, canceled 0, ignored 0, pending 0
[info] All tests passed.
[info] Passed: Total 2, Failed 0, Errors 0, Passed 2
```

- **`Tests succeeded`**：表示所有测试都通过了。
- **`Total number of tests run`**：显示运行的测试数量。

### **5. 测试总结**

1. **ScalaTest 功能**：提供强大的测试工具，可以通过简洁语法编写可读性强的测试用例。

2. 执行测试：

   - 运行所有测试：`sbt test`。
   - 运行单个测试类：`sbt "testOnly ClassName"`。
   
3. **测试结果**：输出详细测试执行状态，方便调试与验证。

ScalaTest 是 ChiselTest 的基础工具，掌握 ScalaTest 可以帮助我们理解 Chisel 电路测试的机制，并为后续深入 ChiselTest 做好准备。

## **3.2.2 ChiselTest**

**ChiselTest** 是 Chisel 官方提供的测试工具，基于 **ScalaTest**，用于验证 Chisel 模块的行为和功能。它支持对硬件设计进行单元测试和仿真，通过定义输入信号和检查输出信号来验证电路逻辑的正确性。

### **1. 引入 ChiselTest 库**

在项目的 `build.sbt` 文件中添加以下依赖项：

```scala
libraryDependencies += "edu.berkeley.cs" %% "chiseltest" % "0.5.6" % "test"
```

- **`chiseltest`**：Chisel 的测试库，基于 ScalaTest。
- **`% "test"`**：表示此库仅用于测试环境。

### **2. 基本测试结构**

测试硬件电路的主要过程分为两个部分：

1. **被测单元（DUT, Device Under Test）**：需要测试的模块。
2. **测试逻辑**：为 DUT 提供输入信号、运行仿真，并验证输出信号。

#### **DUT 示例**

以下是一个简单的被测模块（DUT），它实现了 2 位输入的逻辑加法操作，并输出 2 位结果：

```scala
import chisel3._

class SimpleAdder extends Module {
  val io = IO(new Bundle {
    val a = Input(UInt(2.W))
    val b = Input(UInt(2.W))
    val out = Output(UInt(2.W))
  })

  io.out := io.a + io.b
}
```

此模块有两个 2 位输入 `a` 和 `b`，以及一个 2 位输出 `out`，表示 `a + b` 的结果。

### **3. 编写测试逻辑**

#### **基本测试**

在 `src/test/scala` 中定义测试类，继承 **`AnyFlatSpec`** 并使用 ChiselTest 提供的工具：

```scala
import chisel3._
import chiseltest._
import org.scalatest.flatspec.AnyFlatSpec

class SimpleTest extends AnyFlatSpec with ChiselScalatestTester {
  "DUT" should "add" in {
    test(new SimpleAdder()) { dut =>
      // 设置输入信号
      dut.io.a.poke(1.U)
      dut.io.b.poke(1.U)

      // 运行一个时钟周期
      dut.clock.step()

      // 检查输出信号
      dut.io.out.expect(2.U)
    }
  }
}
```

#### **关键方法解析**

- **`poke`**：设置输入端口的值（类似赋值操作）。
- **`step`**：推动仿真时钟运行一个周期。
- **`expect`**：检查输出端口的值是否符合预期。

### **4. 示例：更复杂的测试**

可以扩展测试逻辑，验证多个输入组合的行为。例如：

```scala
class SimpleTestExtended extends AnyFlatSpec with ChiselScalatestTester {
  "DUT" should "add multiple values" in {
    test(new SimpleAdder()) { dut =>
      // 测试多组输入
      val testCases = Seq(
        (0.U, 0.U, 0.U),
        (1.U, 2.U, 3.U),
        (2.U, 3.U, 5.U),
        (3.U, 3.U, 6.U)
      )

      for ((a, b, expected) <- testCases) {
        dut.io.a.poke(a)
        dut.io.b.poke(b)
        dut.clock.step()
        dut.io.out.expect(expected)
      }
    }
  }
}
```

#### **解释**

- **`Seq`**：定义多组测试数据（输入和期望输出）。
- **`for` 循环**：依次测试每组数据，验证 DUT 的行为是否正确。

### **5. 运行测试**

使用以下命令运行 ChiselTest 测试：

```bash
sbt test
```

### **6. 验证输出**

测试通过时，ScalaTest 的运行结果会显示成功的信息。若测试失败，ChiselTest 会提示错误位置和原因，例如：

```text
[info] SimpleTest:
[info] - DUT should add
[error] Assertion failed: expected=4, actual=3
```

上述信息表明 DUT 的输出不符合预期，便于定位和修复问题。

### **总结**

1. **ChiselTest 功能**：
   - 提供简单的 `poke` 和 `expect` 方法，用于驱动 DUT 和验证结果。
   - 支持时钟控制（`step`）以模拟电路的时序行为。
2. **测试结构**：
   - 定义 DUT 模块。
   - 编写测试逻辑，驱动 DUT 并验证输出。
3. **扩展性**：
   - 支持多组输入输出测试。
   - 结合 Scala 的数据结构（如 `Seq`）管理测试用例。

通过 ChiselTest，可以高效验证硬件模块的功能和行为，为复杂设计提供坚实的测试保障。

## **3.2.3 波形测试（Waveforms）**

在硬件设计中，波形是调试和分析电路行为的重要工具。**ChiselTest** 可以生成 `.vcd` 文件（Value Change Dump），记录设计中所有信号随时间的变化。通过查看波形文件，可以直观地观察电路行为，尤其在复杂设计中，调试多个信号同时变化的情况。

### **1. 生成波形文件**

#### **方法一：通过命令行生成**

在运行测试时，通过命令行设置参数 `-DwriteVcd=1`，启用波形文件生成功能：

```bash
sbt "testOnly SimpleTest -- -DwriteVcd=1"
```

- 运行完成后，会在测试结果的输出目录（通常为

  ```
  test_run_dir
  ```

  ）中生成

  ```
  .vcd
  ```

   文件。例如：

  ```
  test_run_dir/SimpleTest/DeviceUnderTest.vcd
  ```

#### **方法二：通过代码启用波形**

在测试代码中为 `test()` 函数添加注解 **`WriteVcdAnnotation`**：

```scala
import chisel3._
import chiseltest._
import org.scalatest.flatspec.AnyFlatSpec

class WaveformTest extends AnyFlatSpec with ChiselScalatestTester {
  "Waveform" should "pass" in {
    test(new DeviceUnderTest)
      .withAnnotations(Seq(WriteVcdAnnotation)) { dut =>
        dut.io.a.poke(0.U)
        dut.io.b.poke(0.U)
        dut.clock.step()
        dut.io.a.poke(1.U)
        dut.clock.step()
      }
  }
}
```

- 注解 `WriteVcdAnnotation` 会启用波形文件生成功能。
- `.vcd` 文件记录了每个时钟周期的输入输出信号变化。

### **2. 查看波形文件**

#### **GTKWave**

`GTKWave` 是一个开源的波形查看工具，支持 `.vcd` 文件。以下是使用步骤：

1. 打开 GTKWave：

   ```bash
   gtkwave test_run_dir/SimpleTest/DeviceUnderTest.vcd
   ```

2. 在 GTKWave 中：

   - 选择 **File → Open New Window** 打开 `.vcd` 文件。
   - 从左侧信号列表中拖动信号到主窗口。
   - 使用 **File → Write Save File** 保存信号配置，便于下次加载。

### **3. 自动化测试波形生成**

对于较大的输入空间，手动输入信号可能效率低下。可以用代码枚举输入信号并生成波形。

#### **枚举输入信号的测试代码**

以下代码测试了 2 位输入信号的所有可能组合，并生成对应的波形：

```scala
class WaveformCounterTest extends AnyFlatSpec with ChiselScalatestTester {
  "WaveformCounter" should "pass" in {
    test(new DeviceUnderTest)
      .withAnnotations(Seq(WriteVcdAnnotation)) { dut =>
        for (a <- 0 until 4) { // 输入 a 遍历 0~3
          for (b <- 0 until 4) { // 输入 b 遍历 0~3
            dut.io.a.poke(a.U)
            dut.io.b.poke(b.U)
            dut.clock.step() // 每个输入组合运行一个时钟周期
          }
        }
      }
  }
}
```

#### **运行测试**

通过以下命令执行该测试，生成 `.vcd` 文件：

```bash
sbt "testOnly WaveformCounterTest"
```

### **4. 波形调试总结**

#### **优点**

1. **直观可视化**：记录信号随时间的变化，便于分析电路行为。
2. **全信号覆盖**：`.vcd` 文件包含设计中所有寄存器和 IO 信号。
3. **回溯调试**：通过波形，快速定位错误信号。

#### **工具集成**

- **ChiselTest** 通过 `WriteVcdAnnotation` 无缝生成波形文件。
- 波形查看工具如 **GTKWave** 和 **ModelSim** 提供直观的波形浏览界面。

### **示例总结**

通过波形生成和分析，可以增强测试和调试能力，特别是对于复杂的硬件设计，波形提供了对电路行为的深入理解。结合 **ChiselTest** 的波形支持，开发者可以快速定位和修复设计中的问题。

## **3.2.4 printf 调试**

**printf 调试** 是一种常见的调试方法，源自 C 语言中使用 `printf` 打印变量值以调试程序的技术。Chisel 同样支持这种调试方法，可以在模块设计或测试中输出信号的实时值，以便观察电路的行为。

在 Chisel 中，`printf` 调试功能可以在仿真时打印信号值，输出信息会随时钟的上升沿进行更新。

### **1. 在 Chisel 模块中使用 printf**

以下示例展示了如何在一个简单的 2 位输入与运算模块中嵌入 `printf` 调试语句：

#### **模块代码**

```scala
import chisel3._

class DeviceUnderTestPrintf extends Module {
  val io = IO(new Bundle {
    val a = Input(UInt(2.W))
    val b = Input(UInt(2.W))
    val out = Output(UInt(2.W))
  })

  // 实现 AND 运算
  io.out := io.a & io.b

  // printf 调试：打印输入和输出值
  printf("dut: %d %d %d\n", io.a, io.b, io.out)
}
```

#### **关键点**

- **`printf` 语句**：可以插入到模块的任何地方，用于打印信号值。

- 打印格式：支持类似 C 语言和 Scala 的格式化语法。例如：

  - `%d`：整数
  - `\n`：换行符

### **2. 结合测试使用 printf**

测试代码可以运行模块并通过波形或日志观察信号值：

#### **测试代码**

```scala
import chisel3._
import chiseltest._
import org.scalatest.flatspec.AnyFlatSpec

class PrintfTest extends AnyFlatSpec with ChiselScalatestTester {
  "DeviceUnderTestPrintf" should "work" in {
    test(new DeviceUnderTestPrintf) { dut =>
      // 遍历所有可能的输入组合
      for (a <- 0 until 4) {
        for (b <- 0 until 4) {
          dut.io.a.poke(a.U)
          dut.io.b.poke(b.U)
          dut.clock.step()
        }
      }
    }
  }
}
```

#### **运行测试**

运行以下命令执行测试：

```bash
sbt "testOnly PrintfTest"
```

### **3. 输出日志示例**

测试运行时，`printf` 将在每个时钟周期打印输入和输出信号值。例如：

```text
Elaborating design...
Done elaborating.
dut: 0 0 0
dut: 0 1 0
dut: 0 2 0
dut: 0 3 0
dut: 1 0 0
dut: 1 1 1
dut: 1 2 0
dut: 1 3 1
dut: 2 0 0
dut: 2 1 0
dut: 2 2 2
dut: 2 3 2
dut: 3 0 0
dut: 3 1 1
dut: 3 2 2
dut: 3 3 3
```

#### **分析日志**

- 每行输出显示当前输入 `a`、`b` 和输出 `out` 的值。
- 可以通过对比日志和设计预期来验证功能是否正确。

### **4. printf 调试的优点**

- **实时性**：可以动态观察信号值随时钟变化的情况。
- **便捷性**：无需生成波形文件，直接在终端中观察输出。
- **高效性**：对于小规模设计，调试速度更快。

### **5. 使用注意事项**

1. **仿真环境限定**：`printf` 仅在仿真时生效，不会影响综合结果。
2. **性能消耗**：当信号较多或频率较高时，打印过多可能导致仿真速度减慢。
3. **格式支持**：支持 C 和 Scala 的格式化语法，尽量简洁明了。

### **总结**

`printf` 调试是 Chisel 开发中的一种轻量级调试手段。对于简单的模块，`printf` 可以快速验证信号行为；而在更复杂的场景中，可以结合波形文件和 `expect` 测试进行更深入的调试。

### **3.3.1 一个最小的 Chisel 项目**

在这一部分，我们通过 Chisel 示例 **“Hello World”** 项目来探索一个最小的 Chisel 项目结构，以及如何生成 Verilog 代码并运行仿真。

#### **1. 基本项目结构**

一个最小的 Chisel 项目通常包含以下关键文件：

- **`src/main/scala`**：包含硬件描述文件。
- **`src/test/scala`**：包含测试文件。
- **`build.sbt`**：配置 Scala 和 Chisel 的依赖。
- **`Makefile`**（可选）：简化编译和运行命令。

#### **Hello World 示例**

在 **`src/main/scala/Hello.scala`** 中，`Hello` 是一个简单的 LED 闪烁模块。代码如下：

```scala
import chisel3._

class Hello extends Module {
  val io = IO(new Bundle {
    val led = Output(UInt(1.W))
  })

  val CNT_MAX = (50000000 / 2 - 1).U
  val cntReg = RegInit(0.U(32.W))
  val blkReg = RegInit(0.U(1.W))

  cntReg := cntReg + 1.U
  when(cntReg === CNT_MAX) {
    cntReg := 0.U
    blkReg := ~blkReg
  }
  io.led := blkReg
}
```

- **`CNT_MAX`**：设置计数器的最大值（1 Hz 闪烁频率）。
- **`cntReg`**：计数器寄存器。
- **`blkReg`**：LED 状态寄存器。
- **`io.led`**：模块的输出，用于驱动 LED。

#### **2. 生成 Verilog 文件**

要生成 Verilog 文件，需要一个顶层对象，继承 Scala 的 `App`：

```scala
import chisel3.stage._

object Hello extends App {
  emitVerilog(new Hello()) // 生成 Verilog 文件
}
```

运行以下命令，生成 Verilog 代码：

```bash
sbt run
```

生成的 Verilog 文件位于 **`generated/Hello.v`**，可以用文本编辑器查看。Verilog 文件的内容描述了 Chisel 模块的硬件行为，包括：

1. **模块定义**：如 `module Hello`。
2. **信号端口**：如 `io_led`。
3. **自动添加的时钟和复位信号**：`clock` 和 `reset`。

#### **3. 配置文件 `build.sbt`**

`build.sbt` 文件用于配置 Chisel 的依赖项、编译器版本等。示例如下：

```scala
scalaVersion := "2.13.8"

scalacOptions ++= Seq(
  "-feature",
  "-language:reflectiveCalls"
)

val chiselVersion = "3.5.6"
addCompilerPlugin("edu.berkeley.cs" %% "chisel3-plugin" % chiselVersion cross CrossVersion.full)
libraryDependencies ++= Seq(
  "edu.berkeley.cs" %% "chisel3" % chiselVersion,
  "edu.berkeley.cs" %% "chiseltest" % "0.5.6" % Test
)
```

- **`scalaVersion`**：设置 Scala 版本。
- **`chiselVersion`**：指定 Chisel 版本。
- **`libraryDependencies`**：定义 Chisel 和 ChiselTest 的依赖。

##### **切换到最新 Chisel 版本**

可以将 Chisel 依赖版本替换为 `latest.release`，始终使用最新版本：

```scala
libraryDependencies += "edu.berkeley.cs" %% "chisel3" % "latest.release"
```

然后运行以下命令更新依赖：

```bash
sbt update
```

#### **4. 使用 Makefile**

为简化构建流程，可以使用 Makefile。以下是一个简单的 Makefile 示例：

```makefile
run:
 sbt run
```

运行以下命令即可生成 Verilog 文件：

```bash
make run
```

#### **5. 其他内容**

- **FPGA 工程文件**：项目文件中可能包含特定 FPGA 的配置文件（如 Quartus 项目文件）。这些文件定义了 FPGA 引脚与模块端口的映射。
- **README 文件**：文档化项目的目的和构建步骤。

### **总结**

1. **项目结构**：了解了最小 Chisel 项目所需的基本文件和目录。
2. **模块实现**：从简单的 LED 闪烁设计入手，演示了寄存器、计数器和逻辑控制。
3. **工具链**：学习了通过 `sbt` 和 `Makefile` 构建和生成 Verilog 文件的方法。

这是一个起点，更复杂的项目可以在此基础上扩展，例如添加测试文件和硬件生成器模块。

### **3.3.2 使用 GitHub 模板**

**chisel-empty** 是一个最小的 Chisel 项目模板，包含以下内容：

1. 一个简单的加法器模块。
2. 一个测试器，用于验证加法器功能。
3. 一个 Makefile，用于生成 Verilog 文件、运行测试和清理工程。

这个项目被设计为 GitHub 模板，因此你可以轻松地基于此模板创建自己的项目。

#### **如何使用 chisel-empty**

1. **创建新项目**

   - 打开 [chisel-empty GitHub 仓库](https://github.com/freechipsproject/chisel-template)。

   - 点击 **“Use this template”** 按钮，然后创建一个新的 GitHub 仓库。

   - 克隆新创建的项目到本地：

     ```bash
     git clone https://github.com/yourusername/yourprojectname.git
     cd yourprojectname
     ```

2. **探索 Makefile** Makefile 定义了一些常用任务，帮助你快速构建、测试和清理项目。例如：

   - 生成 Verilog 文件：

     ```bash
     make
     ```

   - 运行测试：

     ```bash
     make test
     ```

   - 清理生成的文件：

     ```bash
     make clean
     ```

   你也可以直接使用 `sbt` 或 `git` 命令手动完成这些任务。

### **3.3.3 测试练习**

在上一章中，我们对 LED 闪烁示例进行了扩展，添加了输入端口，用于实现一个简单的 **AND 门** 和一个 **多路复用器（Multiplexer）**。这些硬件设计可以部署到 FPGA 中运行。现在，我们将为这些设计编写 Chisel 测试器，以验证其功能。

#### **测试任务**

- 测试范围：

  - 遍历所有可能的输入组合。
  - 使用 `expect()` 验证输出是否符合预期。

- 目的：

  - 自动化测试。
  - 脱离硬件平台（如 FPGA）的限制，使用仿真验证功能。

#### **测试代码示例**

以下是针对 **AND 门** 的测试代码：

```scala
import chisel3._
import chiseltest._
import org.scalatest.flatspec.AnyFlatSpec

class AndGate extends Module {
  val io = IO(new Bundle {
    val a = Input(UInt(2.W))
    val b = Input(UInt(2.W))
    val out = Output(UInt(2.W))
  })
  io.out := io.a & io.b
}

class AndGateTest extends AnyFlatSpec with ChiselScalatestTester {
  "AndGate" should "pass all input combinations" in {
    test(new AndGate) { dut =>
      for (a <- 0 until 4) {
        for (b <- 0 until 4) {
          dut.io.a.poke(a.U)
          dut.io.b.poke(b.U)
          dut.clock.step()
          dut.io.out.expect((a & b).U) // 期望输出是 a AND b 的结果
        }
      }
    }
  }
}
```

#### **执行测试**

运行以下命令以执行测试：

```bash
sbt test
```

测试完成后，控制台会显示测试结果。如果所有 `expect` 验证通过，测试将显示成功；否则会指出失败的用例。

#### **测试的重要性**

1. **快速调试**：在 FPGA 上运行设计之前，可以在 Chisel 中快速仿真和验证。

2. **硬件验证**：虽然 Chisel 测试器可以验证设计逻辑，但最终仍需要在 FPGA 上综合并运行以检查设计的实际性能。

3. 参考规模：

   - 一个典型的流水线 RISC 处理器设计可能会消耗大约 **3000 个 4-bit LUT**，在低成本 FPGA（如 Intel Cyclone 或 Xilinx Spartan）上运行时，时钟频率可能达到 **100 MHz**。

### **总结**

- 使用 `chisel-empty` 模板可以快速启动新项目，并生成 Verilog 文件或运行测试。
- 编写测试代码是验证硬件设计功能的重要步骤。
- 测试框架结合 `expect()` 方法，可以自动化遍历所有输入组合并验证输出，确保设计符合预期。
