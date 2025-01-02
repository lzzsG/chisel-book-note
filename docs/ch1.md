---
description: 本章介绍了 Chisel 的基本概念和优势，以及如何安装 Chisel 和 FPGA 工具。通过 Hello World 示例，展示了 Chisel 的基本用法。
---

# 第1章：引言

本书介绍了一种现代硬件构造语言 Chisel，用于数字系统设计。它与传统数字设计教材的主要区别在于，本书关注更高的抽象层次，使设计者能够在较短时间内构建更复杂的交互式数字系统。

### 目标读者

本书及 Chisel 面向两类开发者：

1. **硬件设计者**：熟悉 VHDL 或 Verilog 的硬件设计者，通常还借助 Python、Java 或 Tcl 等语言生成硬件。通过 Chisel，可以将硬件生成直接整合到一个语言中，实现单一语言的硬件构造。
2. **软件程序员**：对硬件设计感兴趣的软件工程师，尤其是考虑到未来芯片将包含可编程硬件以加速程序运行。Chisel 也适合作为初学者的第一门硬件描述语言。

### Chisel 的特点与优势

Chisel 将面向对象编程和函数式编程等软件工程的进步引入数字设计领域，既可以在寄存器传输级（RTL）描述硬件，又可以编写硬件生成器（Hardware Generators）。在现代数字设计中，硬件已普遍采用硬件描述语言来表述，而不再依赖 CAD 工具手动绘制。传统的 Verilog 和 VHDL 虽然功能强大，但它们设计年代久远，带有大量遗留特性，在语言中可综合为硬件的构造也存在一定限制。

Chisel 采用 Verilog 作为测试和综合的中间语言，但其核心优势在于利用 Scala 的表达能力。Scala 是一种易于扩展的语言，Chisel 从中继承了许多特性，使其不仅简单且功能强大。

### 学习准备与本书定位

本书并非通用的数字设计入门教材，不涵盖如 CMOS 晶体管构建门电路等基础知识。它的目标是教授当前实践中用于描述 ASIC 和 FPGA 设计的数字设计方法。阅读本书需要具备以下基础：

- **基本知识**：布尔代数和二进制数系统的基础。
- **编程经验**：任何编程语言的基本使用技能。
- **命令行工具**：对 CLI（如终端或 Unix shell）的基本了解。

无需 Verilog 或 VHDL 的背景知识，Chisel 可作为初学者学习硬件描述语言的起点。

### Chisel 的学习特点

Chisel 本身是一种小型语言，其基础构造可以在数天内掌握。本书也不长，专注于数字设计与 Chisel 的教程，而非 Chisel 语言参考手册或完整芯片设计的全面介绍。所有代码示例均经过编译和测试，可从书的 GitHub 仓库获取，确保代码无语法错误，并展示了良好的硬件描述风格。

### 书籍阅读优化

本书针对平板电脑（如 iPad）或笔记本电脑阅读进行了优化，文本中嵌入了进一步阅读的链接（如 Wikipedia）。

## 1.1 安装 Chisel 和 FPGA 工具

Chisel 是一个 Scala 库，安装 Chisel 和 Scala 最简单的方法是使用 Scala 构建工具 sbt。Scala 依赖 Java JDK 1.8 或更高版本。由于 Oracle 修改了 Java 的许可协议，建议安装 AdoptOpenJDK 提供的 OpenJDK。

详细的安装步骤可参考 Chisel Lab 提供的 `Setup.md` 文件，第一部分讲解了如何在 IntelliJ 中打开现有 Chisel 项目。

### 1.1.1 macOS

在 macOS 上安装 OpenJDK 8（或 11）：

1. 使用 Homebrew 安装 sbt 和 git：

   ```bash
   brew install sbt git
   ```

2. 安装 GTKWave 和 IntelliJ（社区版）。

3. 导入项目时，选择之前安装的 JDK。

### 1.1.2 Linux/Ubuntu

在 Ubuntu 上安装 Java 和常用工具：

```bash
sudo apt install openjdk-8-jdk git make gtkwave
```

由于 sbt 尚未作为可直接安装的 Debian 包发布，需要参考 sbt 的官方网站完成安装。

> Note补充：在 VS Code 中运行 Scala 程序需要配置 Scala 的开发环境和工具链。以下是详细的步骤：
>
>
> ### **1. 安装必要的工具**
>
> #### **1.1 安装 JDK**
>
> Scala 运行在 JVM 上，需要安装 JDK。
>
> 1. 下载并安装 [OpenJDK](https://jdk.java.net/) 或 [Oracle JDK](https://www.oracle.com/java/technologies/javase-downloads.html)。
>
> 2. 配置环境变量 `JAVA_HOME`，并确保命令行可以运行 `java`和 `javac`：
>
>    ```bash
>    java -version
>    javac -version
>    ```
>
> #### **1.2 安装 Scala**
>
> 1. 下载并安装 Scala：
>
>    - 使用 [Scala 官网](https://www.scala-lang.org/download/) 提供的安装包。
>
>    - 或通过  Coursier 安装：
>
>      ```bash
>      curl -fL https://get.coursier.io | bash
>      cs setup
>      cs install scala
>      ```
>
> 2. 验证安装：
>
>    ```bash
>    scala -version
>    ```
>
> #### **1.3 安装 SBT**
>
> SBT（Scala Build Tool）是 Scala 的构建工具，用于编译和运行程序。
>
> 1. 安装 SBT：
>
>    - [SBT 官网](https://www.scala-sbt.org/download.html) 提供安装指南。
>
>    - 或通过包管理工具安装：
>
>      - Ubuntu：
>
>        ```bash
>        sudo apt-get install sbt
>        ```
>
>      - macOS：
>
>        ```bash
>        brew install sbt
>        ```
>
> 2. 验证安装：
>
>    ```bash
>    sbt sbtVersion
>    ```
>
> #### **1.4 安装 VS Code 和 Metals 插件**
>
> 1. 安装 VS Code：[VS Code 下载](https://code.visualstudio.com/)。
> 2. 安装 Metals 插件：
>    - 打开 VS Code，进入扩展市场（Ctrl+Shift+X）。
>    - 搜索 "Metals" 并安装。
>
>
> ### **2. 创建和运行一个 Scala 项目**
>
> #### **2.1 创建一个新的 Scala 项目**
>
> 1. 打开终端，运行：
>
>    ```bash
>    sbt new scala/hello-world.g8
>    ```
>
>    - 按提示输入项目名称，例如 `hello-scala`。
>    - SBT 会生成一个标准的 Scala 项目结构。
>
> 2. 进入项目目录：
>
>    ```bash
>    cd hello-scala
>    ```
>
> #### **2.2 在 VS Code 中打开项目**
>
> 1. 在 VS Code 中打开项目目录：
>
>    ```bash
>    code .
>    ```
>
> 2. 启动 Metals：
>
>    - VS Code 会提示 "Import build"，点击 "Import build"。
>    - Metals 会索引项目并配置 IntelliSense。
>
> #### **2.3 编辑代码**
>
> 1. 打开 `src/main/scala/example/Hello.scala` 文件。
>
> 2. 修改或添加代码：
>
>    ```scala
>    object Hello {
>      def main(args: Array[String]): Unit = {
>        println("Hello, Scala with VS Code!")
>      }
>    }
>    ```
>
> #### **2.4 编译和运行程序**
>
> 1. 在终端运行：
>
>    ```bash
>    sbt run
>    ```
>
>    或者直接在 VS Code 中：
>
>    - 点击 "Run" 按钮（右上角的绿色三角形）。
>    - 或使用快捷键（F5）。
>
> ### **3. 直接运行单个 Scala 文件（简单程序）**
>
> 如果只想运行单个 Scala 文件，而不需要 SBT 项目结构：
>
> 1. 创建一个新的 Scala 文件：
>
>    - 在 VS Code 中创建文件，例如 `Hello.scala`。
>
>    - 添加以下代码：
>
>      ```scala
>      object Hello extends App {
>        println("Hello, Scala!")
>      }
>      ```
>
> 2. 在终端运行：
>
>    ```bash
>    scala Hello.scala
>    ```
>
> ### **4. 常见问题与解决方法**
>
> #### **4.1 "Java not found" 错误**
>
> - 确保已安装 JDK，并正确配置 `JAVA_HOME` 环境变量。
>
> - 在终端运行：
>
>   ```bash
>   echo $JAVA_HOME
>   java -version
>   ```
>
> #### **4.2 "Import build failed"**
>
> - 确保 SBT 和 Metals 已正确安装。
> - 删除 `.metals` 和 `.bloop` 文件夹，然后重新导入项目。
>
> #### **4.3 VS Code 无法识别 Scala**
>
> - 确保 Metals 插件已启用。
>
> - 检查 VS Code 的 Java 和 Metals 配置（在 `settings.json`中）：
>
>   ```json
>   {
>     "metals.javaHome": "/path/to/your/java",
>     "metals.serverVersion": "latest.snapshot"
>   }
>   ```
>
> ### **5. 总结**
>
> - 工具链：
>
>   - 安装 JDK、Scala 和 SBT。
>   - 配置 VS Code 和 Metals 插件。
>
> - 项目结构：
>
>   - 使用 SBT 创建标准项目结构。
>   - 或直接运行单个 Scala 文件。
>
> - 运行程序：
>
>   - 使用 SBT 管理依赖和编译。
>   - 通过 VS Code 的 Metals 提供的 IntelliSense 和运行功能，提高开发效率。
>
> 按照以上步骤，你可以轻松在 VS Code 中编写并运行 Scala 程序，同时借助 Metals 和 SBT 的功能，高效开发复杂的 Scala 项目。

### 1.1.3 Windows

在 Windows 上：

1. 从 AdoptOpenJDK 安装 OpenJDK（8 或 11）。
2. 安装 GTKWave 和 IntelliJ（社区版）。
3. 使用 Windows 安装程序安装 sbt（参考 sbt 官网）。
4. 安装 git 客户端。

### 1.1.4 FPGA 工具

构建 FPGA 硬件需要综合工具。主要 FPGA 厂商 Intel 和 AMD 提供免费版本的工具，分别是：

- **Intel**：Quartus Prime Lite Edition
- **AMD**：Vivado Design Suite WebPACK Edition

这些工具适用于 Windows 和 Linux，但不支持 macOS。此外，F4PGA 提供了针对特定 FPGA 的开源综合工具，是一种新选择。

## 1.2 Hello World

每本编程语言的书籍通常都会以一个最小示例开始，即著名的 Hello World 示例。以下代码展示了一个简单的 Scala 示例：

```scala
object HelloScala extends App {
  println("Hello Chisel World!")
}
```

通过 sbt 编译和执行这段代码，可以得到预期的输出：

```bash
$ sbt run
[info] Running HelloScala
Hello Chisel World!
```

然而，这段代码实际上只是标准的 Scala 程序，而非硬件设计的代表性 Hello World 示例。它并未生成硬件，也不是 Chisel 的实际用法。

## 1.3 Chisel 的 Hello World

硬件设计中的 Hello World 示例是什么？它通常被定义为最小且可见的有用设计。在硬件设计中，**闪烁的 LED** 被广泛认为是硬件领域的 Hello World 示例。当 LED 能够闪烁时，意味着环境配置已经正确，可以继续解决更复杂的问题。

下面是一个用 Chisel 描述的 LED 闪烁示例（见代码清单 1.1）。虽然目前无需理解其细节，但可以了解以下核心逻辑：

- 硬件电路通常以高频率时钟（如 50 MHz）运行。
- 为实现可见的闪烁效果，需要一个计数器将时钟频率降低到 Hz 范围。
- 在示例中，当计数器从 0 计到 25000000 - 1 时：
  - 翻转闪烁信号（`blkReg := ˜blkReg`）。
  - 重置计数器（`cntReg := 0.U`）。

该硬件设计使 LED 以 1 Hz 的频率闪烁。

### 代码清单 1.1: 用 Chisel 实现的硬件 Hello World

```scala
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

该设计中：

- **`CNT_MAX`** 定义了计数器的最大值（50 MHz 时钟周期的一半）。
- **`cntReg`** 是一个 32 位寄存器，用于记录计数。
- **`blkReg`** 是一个 1 位寄存器，控制 LED 的闪烁状态。
- 当计数器达到最大值时，计数器复位，且 LED 状态翻转。

## 1.4 为 Chisel 选择 IDE

本书对开发环境或编辑器没有强制要求，仅需通过 sbt 结合您喜欢的编辑器即可轻松学习基础内容。在传统实践中，命令行的提示符 `$` 表示在 shell/终端中执行的命令（无需实际键入 `$`）。例如：

```bash
ls
```

不过，使用集成开发环境（IDE）可以显著提高开发效率，因为 IDE 会在后台运行编译器，提供实时的代码反馈。由于 Chisel 是 Scala 的一个库，支持 Scala 的 IDE 同样支持 Chisel。以下是几种推荐的 IDE：

### IntelliJ

1. 安装 Scala 插件。
2. 通过 **File > New > Project from Existing Sources...**，选择项目中的 `build.sbt` 文件创建项目。

### Eclipse

1. 使用 sbt 生成 Eclipse 项目：

   ```bash
   sbt eclipse
   ```

2. 将生成的项目导入 Eclipse（需要安装 sbt 的 Eclipse 插件）。

### Visual Studio Code

1. 安装 Scala Metals 扩展。
2. 在扩展栏搜索 "Metals"，安装 Scala 支持。
3. 使用 **File > Open** 打开基于 sbt 的项目文件夹。

通过以上内容，您已了解 Chisel 的 Hello World 示例以及如何配置开发环境，这为后续深入学习奠定了坚实的基础。

## 1.5 源代码获取与电子书功能

本书是开源项目，托管在 GitHub 仓库 [schoeberl/chisel-book](https://github.com/schoeberl/chisel-book)。书中展示的所有 Chisel 代码示例都包含在该仓库中，所有代码均通过编译器验证，确保没有语法错误。此外，大部分示例还附带了测试平台（testbench）。这些代码均从源码中自动提取，方便用户直接使用或进一步探索。

### 开源代码资源

- **代码仓库**：本书的代码示例可在 [chisel-examples](https://github.com/schoeberl/chisel-examples) 和 [ip-contributions](https://github.com/schoeberl/ip-contributions) 仓库中找到更大的 Chisel 示例集合。
- **反馈与改进**：如果您发现书中的错误或排版问题，最便捷的方式是通过 GitHub 提交 Pull Request。您也可以通过创建 GitHub Issue 或发送电子邮件提供反馈。

### 教学资源

本书的 GitHub 仓库还包含基于 Latex 的课程幻灯片，这些幻灯片用于丹麦技术大学为期 13 周的《数字电子学》课程。这些资源还包括基于 Chisel 的实验练习。如果您正在教授 Chisel 数字设计课程，可以根据需求自由调整幻灯片和实验内容。所有材料均为开源，您可以使用以下命令一键生成书籍和幻灯片：

```bash
make
```

此命令会编译所有代码、运行测试、提取代码并使用 Latex 生成 PDF 文档。

### 电子书版本特点

本书提供免费的 PDF 电子书版本以及亚马逊上销售的传统纸质版。电子书版优化了平板电脑（如 iPad）上的阅读体验，并包含许多指向额外资源和维基百科条目的链接。这些链接提供了书中未直接涵盖的背景知识（如二进制数系统）。

## 1.6 延伸阅读

以下是一些推荐的数字设计与 Chisel 相关资源：

### 数字设计基础

- **《Digital Design: A Systems Approach》**
   作者：William J. Dally 和 R. Curtis Harting。
   这本教材提供了基于 Verilog 或 VHDL 的数字设计方法。

### Chisel 官方与相关文档

- **[Chisel 官网](https://www.chisel-lang.org/)**
   下载 Chisel 并获取官方教程的起点。
- **丹麦技术大学 [Digital Electronics 2](http://www2.imm.dtu.dk/courses/02139/) 课程网站**
   提供基于 Chisel 的 13 周课程幻灯片，相关源代码也包含在本书仓库中，可根据教学需求调整使用。
- **[schoeberl/chisel-lab](https://github.com/schoeberl/chisel-lab)**
   包含适用于《Digital Electronics 2》课程的 Chisel 练习，同样适合自学者使用。
- **[Chisel 空项目模板](https://github.com/schoeberl/chisel-empty)**
   提供一个包含简单硬件（如加法器）和测试的极简项目，适合作为起点创建新的 GitHub 仓库。
- **[Chisel3 Cheat Sheet](https://github.com/freechipsproject/chisel3/wiki/Cheat-Sheet)**
   用一页总结 Chisel 的主要构造，方便查阅。
- **[Scott Beamer 的 Agile Hardware Design 课程](https://scottbeamer.github.io/agile-hardware-design/)**
   提供高级 Chisel 示例，包含可执行的 Jupyter notebook 源代码。
- **[ChiselTest 仓库](https://github.com/ucb-bar/chisel-testers2)**
   提供 Chisel 的测试工具和最新的测试框架资源。
- **[Generator Bootcamp](https://github.com/freechipsproject/chisel-bootcamp)**
   聚焦硬件生成器的 Chisel 课程，以 Jupyter notebook 形式提供。
- **[Chisel Tutorial](https://github.com/ucb-bar/chisel-tutorial)**
   提供一个带有测试器和解决方案的小型练习项目。尽管有些内容略显过时，但仍具参考价值。
- **[Chisel 风格指南](https://github.com/ucb-bar/chisel-style-guide)**
   作者：Christopher Celio，提供了关于 Chisel 编码风格的建议。

通过本章节，您可以获取相关代码资源并深入探索 Chisel 的应用。这些资源覆盖了从基础到进阶的各类内容，既适合教学，也适合自学。

## 1.7 实践练习

每章的最后都会包含实践练习，通过动手操作巩固所学内容。本章的练习目标是使用 FPGA 开发板实现一个闪烁的 LED，这可以视为硬件设计的 “Hello World” 示例。

### 第一步：获取代码

1. 克隆或分叉 Chisel 示例代码库：

   ```bash
   git clone https://github.com/schoeberl/chisel-examples.git
   cd chisel-examples/hello-world/
   ```

2. 查看 `src/main/scala/Hello.scala` 文件中的 Chisel 代码，了解如何描述闪烁的 LED。

### 第二步：编译生成 Verilog 文件

使用以下命令编译 Chisel 代码：

```bash
sbt run
```

首次运行时，工具会自动下载 Chisel 相关组件。编译完成后，将生成一个名为 `Hello.v` 的 Verilog 文件。

在查看生成的 Verilog 文件时，可以注意以下几点：

- 输入与输出：

  - Verilog 文件中包含两个输入信号：`clock` 和 `reset`，以及一个输出信号：`io_led`。
  - Chisel 模块中并未显式声明 `clock` 和 `reset` 信号，这些信号由 Chisel 自动生成并管理。

- 自动化时钟与复位连接：

  - Chisel 提供了寄存器组件，这些组件会自动连接时钟和复位信号（如果需要），简化了硬件描述。

### 第三步：配置 FPGA 并运行

要在 FPGA 上运行代码，需要以下步骤：

1. 使用 FPGA 综合工具（如 Intel Quartus 或 AMD Vivado）设置 FPGA 项目文件，分配引脚，编译 Verilog 代码，并生成位流文件（bitfile）。
2. 将生成的位流文件加载到 FPGA 上。具体操作请参阅 FPGA 工具的用户手册。

示例代码库中的 `quartus` 文件夹包含针对多个常用 FPGA 开发板（如 DE2-115）的预配置 Quartus 项目：

- 如果您的开发板受支持，可以直接在 Quartus 中打开相关项目。
- 点击“播放”按钮编译项目，使用“程序”按钮将位流文件加载到 FPGA，完成后应该可以看到一个 LED 闪烁。

#### 验证与调整

1. 如果 LED 未闪烁：
   - 检查 `reset` 信号的状态（例如，DE2-115 上的 `reset` 输入连接到 `SW0` 开关）。
2. 修改闪烁频率：
   - 将闪烁频率调快或调慢，观察其效果。
   - 不同的闪烁频率和模式可以传递不同的“情绪”：
     - 慢速闪烁：表示系统正常。
     - 快速闪烁：表示报警状态。

### 扩展练习

1. **生成特殊闪烁模式**：

   - 设计一个 LED 闪烁模式：LED 每秒亮 200 毫秒。
   - 为此，您需要增加一个新的常量，并通过该常量控制 `blkReg` 寄存器的状态变化。
   - 思考：这种模式传递的情绪是警报状态还是“生存信号”？

2. **模拟运行（无 FPGA 开发板）**：

   - 如果没有 FPGA 板，可通过 Chisel 仿真运行闪烁 LED 示例。

   - 为缩短仿真时间，将 Chisel 代码中的时钟频率从 `50000000` 降低到 `50000`。

   - 执行以下命令运行仿真：

     ```bash
     sbt test
     ```

   - 仿真器将在一百万个时钟周期内运行，具体的闪烁频率取决于仿真速度以及您的计算机性能。可能需要调整时钟频率以观察到模拟的闪烁效果。

通过完成以上练习，您将掌握 Chisel 基础开发流程、硬件综合及 FPGA 部署操作，为后续学习复杂设计打下坚实基础。
