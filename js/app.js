/**
 * AXAM Demo — Core Application
 * No backend required. Real lecture data with YouTube URLs. Demo modal for LLM features.
 */
const AXAM = (() => {
  let currentPage = 'home';

  // ── Mock Data — Real MIT OCW lectures with YouTube URLs ─────
  const MOCK_SUBJECTS = [
    {
      name: "Mathematics",
      icon: "\uD83D\uDCD0",
      course_count: 12,
      lecture_count: 820,
      courses: [
        {
          code: "18.01", display_name: "MIT 18.01 \u2014 Single Variable Calculus",
          lecture_count: 39,
          lectures: [
            { video_id: "7K1sB05pE0A", title: "Lec 1 | MIT 18.01 Single Variable Calculus, Fall 2007", url: "https://www.youtube.com/watch?v=7K1sB05pE0A", duration: 3093, view_count: 2635042, subject: "Mathematics", course_code: "18.01" },
            { video_id: "ryLdyDrBfvI", title: "Lec 2 | MIT 18.01 Single Variable Calculus, Fall 2007", url: "https://www.youtube.com/watch?v=ryLdyDrBfvI", duration: 3167, view_count: 929914, subject: "Mathematics", course_code: "18.01" },
            { video_id: "kCPVBl953eY", title: "Lec 3 | MIT 18.01 Single Variable Calculus, Fall 2007", url: "https://www.youtube.com/watch?v=kCPVBl953eY", duration: 2995, view_count: 610040, subject: "Mathematics", course_code: "18.01" },
            { video_id: "4sTKcvYMNxk", title: "Lec 4 | MIT 18.01 Single Variable Calculus, Fall 2007", url: "https://www.youtube.com/watch?v=4sTKcvYMNxk", duration: 2763, view_count: 420094, subject: "Mathematics", course_code: "18.01" },
            { video_id: "5q_3FDOkVRQ", title: "Lec 5 | MIT 18.01 Single Variable Calculus, Fall 2007", url: "https://www.youtube.com/watch?v=5q_3FDOkVRQ", duration: 2941, view_count: 399453, subject: "Mathematics", course_code: "18.01" },
          ]
        },
        {
          code: "18.02", display_name: "MIT 18.02 \u2014 Multivariable Calculus",
          lecture_count: 35,
          lectures: [
            { video_id: "PxCxlsl_YwY", title: "Lec 1: Dot product | MIT 18.02 Multivariable Calculus, Fall 2007", url: "https://www.youtube.com/watch?v=PxCxlsl_YwY", duration: 2321, view_count: 1829940, subject: "Mathematics", course_code: "18.02" },
            { video_id: "9FLItlbBUPY", title: "Lec 2: Determinants; cross product | MIT 18.02 Multivariable Calculus, Fall 2007", url: "https://www.youtube.com/watch?v=9FLItlbBUPY", duration: 3171, view_count: 567287, subject: "Mathematics", course_code: "18.02" },
            { video_id: "bHdzkFrgRcA", title: "Lec 3: Matrices; inverse matrices | MIT 18.02 Multivariable Calculus, Fall 2007", url: "https://www.youtube.com/watch?v=bHdzkFrgRcA", duration: 3065, view_count: 418523, subject: "Mathematics", course_code: "18.02" },
            { video_id: "YBajUR3EFSM", title: "Lec 4: Square systems; equations of planes | MIT 18.02 Multivariable Calculus, Fall 2007", url: "https://www.youtube.com/watch?v=YBajUR3EFSM", duration: 2942, view_count: 330202, subject: "Mathematics", course_code: "18.02" },
            { video_id: "57jzPlxf4fk", title: "Lec 5: Parametric equations for lines and curves | MIT 18.02 Multivariable Calculus, Fall 2007", url: "https://www.youtube.com/watch?v=57jzPlxf4fk", duration: 3050, view_count: 316617, subject: "Mathematics", course_code: "18.02" },
          ]
        },
        {
          code: "18.03", display_name: "MIT 18.03 \u2014 Differential Equations",
          lecture_count: 33,
          lectures: [
            { video_id: "XDhJ8lVGbl8", title: "Lec 1 | MIT 18.03 Differential Equations, Spring 2006", url: "https://www.youtube.com/watch?v=XDhJ8lVGbl8", duration: 2936, view_count: 2003184, subject: "Mathematics", course_code: "18.03" },
            { video_id: "LbKKzMag5Rc", title: "Lec 2 | MIT 18.03 Differential Equations, Spring 2006", url: "https://www.youtube.com/watch?v=LbKKzMag5Rc", duration: 3045, view_count: 359588, subject: "Mathematics", course_code: "18.03" },
            { video_id: "tVzaX9u6YAE", title: "Lec 3 | MIT 18.03 Differential Equations, Spring 2006", url: "https://www.youtube.com/watch?v=tVzaX9u6YAE", duration: 3023, view_count: 360061, subject: "Mathematics", course_code: "18.03" },
            { video_id: "WBJ_iXudb-s", title: "Lec 4 | MIT 18.03 Differential Equations, Spring 2006", url: "https://www.youtube.com/watch?v=WBJ_iXudb-s", duration: 3014, view_count: 239825, subject: "Mathematics", course_code: "18.03" },
          ]
        },
        {
          code: "18.06", display_name: "MIT 18.06 \u2014 Linear Algebra",
          lecture_count: 34,
          lectures: [
            { video_id: "YeyrH-Oc2p4", title: "Course Introduction | MIT 18.06SC Linear Algebra", url: "https://www.youtube.com/watch?v=YeyrH-Oc2p4", duration: 433, view_count: 198209, subject: "Mathematics", course_code: "18.06" },
            { video_id: "umt6BB1nJ4w", title: "Lec 25 | MIT 18.06 Linear Algebra, Spring 2005", url: "https://www.youtube.com/watch?v=umt6BB1nJ4w", duration: 2632, view_count: 197968, subject: "Mathematics", course_code: "18.06" },
            { video_id: "Cx5Z-OslNWE", title: "Course Introduction of 18.065 by Professor Strang", url: "https://www.youtube.com/watch?v=Cx5Z-OslNWE", duration: 424, view_count: 582514, subject: "Mathematics", course_code: "18.06" },
          ]
        },
      ]
    },
    {
      name: "Physics",
      icon: "\u269B\uFE0F",
      course_count: 9,
      lecture_count: 680,
      courses: [
        {
          code: "8.01", display_name: "MIT 8.01 \u2014 Classical Mechanics",
          lecture_count: 35,
          lectures: [
            { video_id: "wWnfJ0-xhAk", title: "Lec 1 | MIT 8.01 Physics I: Classical Mechanics, Fall 1999", url: "https://www.youtube.com/watch?v=wWnfJ0-xhAk", duration: 3060, view_count: 5600000, subject: "Physics", course_code: "8.01" },
            { video_id: "GtOGurrUlAs", title: "Lec 2 | MIT 8.01 1D Kinematics and Speed", url: "https://www.youtube.com/watch?v=GtOGurrUlAs", duration: 3000, view_count: 2100000, subject: "Physics", course_code: "8.01" },
            { video_id: "F3N5EkMX_ks", title: "8.01SC Classical Mechanics Introduction", url: "https://www.youtube.com/watch?v=F3N5EkMX_ks", duration: 135, view_count: 339234, subject: "Physics", course_code: "8.01" },
            { video_id: "i4u7SZjoAs4", title: "1.0 Week 1 Introduction (8.01 Classical Mechanics)", url: "https://www.youtube.com/watch?v=i4u7SZjoAs4", duration: 135, view_count: 86756, subject: "Physics", course_code: "8.01" },
          ]
        },
        {
          code: "8.02", display_name: "MIT 8.02 \u2014 Electricity and Magnetism",
          lecture_count: 36,
          lectures: [
            { video_id: "rtlJoXxEtbg", title: "Lec 1 | MIT 8.02 Electricity and Magnetism, Spring 2002", url: "https://www.youtube.com/watch?v=rtlJoXxEtbg", duration: 3120, view_count: 3800000, subject: "Physics", course_code: "8.02" },
            { video_id: "x1-SibwIPM4", title: "Lec 2 | MIT 8.02 Electric Field and Dipoles", url: "https://www.youtube.com/watch?v=x1-SibwIPM4", duration: 3060, view_count: 1600000, subject: "Physics", course_code: "8.02" },
          ]
        },
        {
          code: "8.04", display_name: "MIT 8.04 \u2014 Quantum Physics I",
          lecture_count: 24,
          lectures: [
            { video_id: "jANZxzetPaQ", title: "Quantum mechanics as a framework. Defining linearity", url: "https://www.youtube.com/watch?v=jANZxzetPaQ", duration: 4560, view_count: 1271729, subject: "Physics", course_code: "8.04" },
            { video_id: "qu-jyrwW6hw", title: "Lecture 8: Quantum Harmonic Oscillator", url: "https://www.youtube.com/watch?v=qu-jyrwW6hw", duration: 4800, view_count: 391393, subject: "Physics", course_code: "8.04" },
            { video_id: "l-BNoAPe6qo", title: "2. Discovery of electron and nucleus, need for quantum mechanics", url: "https://www.youtube.com/watch?v=l-BNoAPe6qo", duration: 4620, view_count: 220573, subject: "Physics", course_code: "8.04" },
            { video_id: "XxRjzphItU0", title: "1. Quantum Mechanics\u2014Historical Background, Photoelectric Effect, Compton Scattering", url: "https://www.youtube.com/watch?v=XxRjzphItU0", duration: 4500, view_count: 165610, subject: "Physics", course_code: "8.04" },
          ]
        },
      ]
    },
    {
      name: "Computer Science",
      icon: "\uD83D\uDCBB",
      course_count: 15,
      lecture_count: 1240,
      courses: [
        {
          code: "6.006", display_name: "MIT 6.006 \u2014 Introduction to Algorithms",
          lecture_count: 24,
          lectures: [
            { video_id: "HtSuA80QTyo", title: "Lecture 1: Algorithmic Thinking, Peak Finding", url: "https://www.youtube.com/watch?v=HtSuA80QTyo", duration: 3180, view_count: 5877591, subject: "Computer Science", course_code: "6.006" },
            { video_id: "ZA-tUyM_y7s", title: "1. Algorithms and Computation", url: "https://www.youtube.com/watch?v=ZA-tUyM_y7s", duration: 3060, view_count: 1806482, subject: "Computer Science", course_code: "6.006" },
            { video_id: "JPyuH4qXLZ0", title: "Lec 1 | MIT 6.046J / 18.410J Introduction to Algorithms (SMA 5503), Fall 2005", url: "https://www.youtube.com/watch?v=JPyuH4qXLZ0", duration: 4836, view_count: 1480791, subject: "Computer Science", course_code: "6.006" },
            { video_id: "whjt_N9uYFI", title: "Lec 2 | MIT 6.046J / 18.410J Introduction to Algorithms (SMA 5503), Fall 2005", url: "https://www.youtube.com/watch?v=whjt_N9uYFI", duration: 4231, view_count: 421705, subject: "Computer Science", course_code: "6.006" },
          ]
        },
        {
          code: "6.042J", display_name: "MIT 6.042J \u2014 Mathematics for Computer Science",
          lecture_count: 25,
          lectures: [
            { video_id: "L3LMbpZIKhQ", title: "Lec 1 | MIT 6.042J Mathematics for Computer Science, Fall 2010", url: "https://www.youtube.com/watch?v=L3LMbpZIKhQ", duration: 2649, view_count: 2678380, subject: "Computer Science", course_code: "6.042J" },
            { video_id: "z8HKWUWS-lA", title: "Lec 2 | MIT 6.042J Mathematics for Computer Science, Fall 2010", url: "https://www.youtube.com/watch?v=z8HKWUWS-lA", duration: 4765, view_count: 759363, subject: "Computer Science", course_code: "6.042J" },
            { video_id: "NuGDkmwEObM", title: "Lec 3 | MIT 6.042J Mathematics for Computer Science, Fall 2010", url: "https://www.youtube.com/watch?v=NuGDkmwEObM", duration: 4920, view_count: 400415, subject: "Computer Science", course_code: "6.042J" },
            { video_id: "h9wxtqoa1jY", title: "Lec 6 | MIT 6.042J Mathematics for Computer Science, Fall 2010", url: "https://www.youtube.com/watch?v=h9wxtqoa1jY", duration: 4971, view_count: 388977, subject: "Computer Science", course_code: "6.042J" },
          ]
        },
        {
          code: "6.034", display_name: "MIT 6.034 \u2014 Artificial Intelligence",
          lecture_count: 30,
          lectures: [
            { video_id: "t4K6lney7Zw", title: "1. Artificial Intelligence and Machine Learning", url: "https://www.youtube.com/watch?v=t4K6lney7Zw", duration: 4464, view_count: 682949, subject: "Computer Science", course_code: "6.034" },
            { video_id: "kHyNqSnzP8Y", title: "13. Learning: Genetic Algorithms", url: "https://www.youtube.com/watch?v=kHyNqSnzP8Y", duration: 2940, view_count: 541206, subject: "Computer Science", course_code: "6.034" },
          ]
        },
      ]
    },
    {
      name: "Biology",
      icon: "\uD83E\uDDEC",
      course_count: 6,
      lecture_count: 520,
      courses: [
        {
          code: "7.012", display_name: "MIT 7.012 \u2014 Introductory Biology",
          lecture_count: 35,
          lectures: [
            { video_id: "_m4Gvu90Ydw", title: "Lec 1 | MIT 7.012 Introduction to Biology, Fall 2004", url: "https://www.youtube.com/watch?v=_m4Gvu90Ydw", duration: 2178, view_count: 331679, subject: "Biology", course_code: "7.012" },
            { video_id: "_CovlKXmuWo", title: "Lec 2 | MIT 7.012 Introduction to Biology, Fall 2004", url: "https://www.youtube.com/watch?v=_CovlKXmuWo", duration: 2889, view_count: 115766, subject: "Biology", course_code: "7.012" },
            { video_id: "9iaoypSrIT0", title: "Lec 6 | MIT 7.012 Introduction to Biology, Fall 2004", url: "https://www.youtube.com/watch?v=9iaoypSrIT0", duration: 3061, view_count: 54260, subject: "Biology", course_code: "7.012" },
            { video_id: "t5Y89b-3Zvc", title: "Lec 4 | MIT 7.012 Introduction to Biology, Fall 2004", url: "https://www.youtube.com/watch?v=t5Y89b-3Zvc", duration: 3016, view_count: 38787, subject: "Biology", course_code: "7.012" },
            { video_id: "9WwJr2yrv2I", title: "Lec 7 | MIT 7.012 Introduction to Biology, Fall 2004", url: "https://www.youtube.com/watch?v=9WwJr2yrv2I", duration: 3076, view_count: 37267, subject: "Biology", course_code: "7.012" },
          ]
        },
        {
          code: "7.013", display_name: "MIT 7.013 \u2014 Introductory Biology",
          lecture_count: 36,
          lectures: [
            { video_id: "u6GHfkq8Aq4", title: "Lec 19 | MIT 7.013 Introductory Biology", url: "https://www.youtube.com/watch?v=u6GHfkq8Aq4", duration: 2811, view_count: 19404, subject: "Biology", course_code: "7.013" },
            { video_id: "CpYFD01gSWM", title: "Lec 29 | MIT 7.013 Introductory Biology", url: "https://www.youtube.com/watch?v=CpYFD01gSWM", duration: 2972, view_count: 10227, subject: "Biology", course_code: "7.013" },
            { video_id: "UWxND4VTz-g", title: "Lec 23 | MIT 7.013 Introductory Biology", url: "https://www.youtube.com/watch?v=UWxND4VTz-g", duration: 2854, view_count: 6554, subject: "Biology", course_code: "7.013" },
          ]
        },
      ]
    },
    {
      name: "Chemistry",
      icon: "\uD83E\uDDEA",
      course_count: 5,
      lecture_count: 380,
      courses: [
        {
          code: "5.111", display_name: "MIT 5.111 \u2014 Principles of Chemical Science",
          lecture_count: 35,
          lectures: [
            { video_id: "2x3F08_8B80", title: "Lec 1 | MIT 5.111 Principles of Chemical Science, Fall 2005", url: "https://www.youtube.com/watch?v=2x3F08_8B80", duration: 2521, view_count: 221823, subject: "Chemistry", course_code: "5.111" },
            { video_id: "RUjePzTQfQg", title: "Lec 14 | MIT 5.111 Principles of Chemical Science, Fall 2005", url: "https://www.youtube.com/watch?v=RUjePzTQfQg", duration: 3052, view_count: 56664, subject: "Chemistry", course_code: "5.111" },
            { video_id: "ZYMBrwSahMY", title: "Lec 2 | MIT 5.111 Principles of Chemical Science, Fall 2005", url: "https://www.youtube.com/watch?v=ZYMBrwSahMY", duration: 2116, view_count: 41987, subject: "Chemistry", course_code: "5.111" },
            { video_id: "ZzMdrYTCPO4", title: "Lec 3 | MIT 5.111 Principles of Chemical Science, Fall 2005", url: "https://www.youtube.com/watch?v=ZzMdrYTCPO4", duration: 2769, view_count: 30865, subject: "Chemistry", course_code: "5.111" },
            { video_id: "91fCFo_LbwM", title: "Lec 4 | MIT 5.111 Principles of Chemical Science, Fall 2005", url: "https://www.youtube.com/watch?v=91fCFo_LbwM", duration: 2853, view_count: 25662, subject: "Chemistry", course_code: "5.111" },
          ]
        },
      ]
    },
    {
      name: "Economics",
      icon: "\uD83D\uDCCA",
      course_count: 7,
      lecture_count: 460,
      courses: [
        {
          code: "14.01", display_name: "MIT 14.01 \u2014 Principles of Microeconomics",
          lecture_count: 26,
          lectures: [
            { video_id: "Vss3nofHpZI", title: "Lec 1 | MIT 14.01SC Principles of Microeconomics", url: "https://www.youtube.com/watch?v=Vss3nofHpZI", duration: 2054, view_count: 2163910, subject: "Economics", course_code: "14.01" },
            { video_id: "zFIB8-30YhA", title: "Lec 2 | MIT 14.01SC Principles of Microeconomics", url: "https://www.youtube.com/watch?v=zFIB8-30YhA", duration: 2947, view_count: 655045, subject: "Economics", course_code: "14.01" },
            { video_id: "Ye4vL7u6N2g", title: "Lec 3 | MIT 14.01SC Principles of Microeconomics", url: "https://www.youtube.com/watch?v=Ye4vL7u6N2g", duration: 2878, view_count: 388205, subject: "Economics", course_code: "14.01" },
            { video_id: "9kH0x7V_0Ig", title: "Lec 4 | MIT 14.01SC Principles of Microeconomics", url: "https://www.youtube.com/watch?v=9kH0x7V_0Ig", duration: 2890, view_count: 349285, subject: "Economics", course_code: "14.01" },
            { video_id: "TIWE0DaOlzU", title: "Lec 5 | MIT 14.01SC Principles of Microeconomics", url: "https://www.youtube.com/watch?v=TIWE0DaOlzU", duration: 2774, view_count: 204951, subject: "Economics", course_code: "14.01" },
          ]
        },
        {
          code: "14.02", display_name: "MIT 14.02 \u2014 Principles of Macroeconomics",
          lecture_count: 24,
          lectures: [
            { video_id: "heBErnN3ZPk", title: "Lecture 1: Introduction to 14.02 Principles of Macroeconomics", url: "https://www.youtube.com/watch?v=heBErnN3ZPk", duration: 1770, view_count: 578721, subject: "Economics", course_code: "14.02" },
          ]
        },
      ]
    },
    {
      name: "Engineering",
      icon: "\u2699\uFE0F",
      course_count: 14,
      lecture_count: 1100,
      courses: [
        {
          code: "6.002", display_name: "MIT 6.002 \u2014 Circuits and Electronics",
          lecture_count: 26,
          lectures: [
            { video_id: "AfQxyVuLeCs", title: "Lec 1 | MIT 6.002 Circuits and Electronics, Spring 2007", url: "https://www.youtube.com/watch?v=AfQxyVuLeCs", duration: 2470, view_count: 1167438, subject: "Engineering", course_code: "6.002" },
            { video_id: "2vHGYdepKLw", title: "Lec 2 | MIT 6.002 Circuits and Electronics, Spring 2007", url: "https://www.youtube.com/watch?v=2vHGYdepKLw", duration: 2950, view_count: 427649, subject: "Engineering", course_code: "6.002" },
            { video_id: "RsJ1eg7XNVs", title: "Lec 3 | MIT 6.002 Circuits and Electronics, Spring 2007", url: "https://www.youtube.com/watch?v=RsJ1eg7XNVs", duration: 3073, view_count: 262388, subject: "Engineering", course_code: "6.002" },
            { video_id: "4TCnYYpZxEc", title: "Lec 4 | MIT 6.002 Circuits and Electronics, Spring 2007", url: "https://www.youtube.com/watch?v=4TCnYYpZxEc", duration: 2947, view_count: 212674, subject: "Engineering", course_code: "6.002" },
            { video_id: "v6vqWasIHaw", title: "Lec 5 | MIT 6.002 Circuits and Electronics, Spring 2007", url: "https://www.youtube.com/watch?v=v6vqWasIHaw", duration: 3068, view_count: 152325, subject: "Engineering", course_code: "6.002" },
          ]
        },
      ]
    },
    {
      name: "Brain & Cognitive Sciences",
      icon: "\uD83E\uDDE0",
      course_count: 4,
      lecture_count: 280,
      courses: [
        {
          code: "9.00", display_name: "MIT 9.00SC \u2014 Introduction to Psychology",
          lecture_count: 24,
          lectures: [
            { video_id: "2fbrl6WoIyo", title: "Lec 1 | MIT 9.00SC Introduction to Psychology, Spring 2011", url: "https://www.youtube.com/watch?v=2fbrl6WoIyo", duration: 2984, view_count: 3208140, subject: "Brain & Cognitive Sciences", course_code: "9.00" },
            { video_id: "syXplPKQb_o", title: "Lec 2 | MIT 9.00SC Introduction to Psychology, Spring 2011", url: "https://www.youtube.com/watch?v=syXplPKQb_o", duration: 4276, view_count: 981327, subject: "Brain & Cognitive Sciences", course_code: "9.00" },
            { video_id: "SjjGiqf96rI", title: "Lec 3 | MIT 9.00SC Introduction to Psychology, Spring 2011", url: "https://www.youtube.com/watch?v=SjjGiqf96rI", duration: 3259, view_count: 416152, subject: "Brain & Cognitive Sciences", course_code: "9.00" },
            { video_id: "-cK1og4ElKE", title: "Lec 4 | MIT 9.00SC Introduction to Psychology, Spring 2011", url: "https://www.youtube.com/watch?v=-cK1og4ElKE", duration: 4261, view_count: 256378, subject: "Brain & Cognitive Sciences", course_code: "9.00" },
            { video_id: "v4ur5mna060", title: "Lec 5 | MIT 9.00SC Introduction to Psychology, Spring 2011", url: "https://www.youtube.com/watch?v=v4ur5mna060", duration: 2459, view_count: 166180, subject: "Brain & Cognitive Sciences", course_code: "9.00" },
          ]
        },
      ]
    },
    {
      name: "Earth & Environmental Sciences",
      icon: "\uD83C\uDF0D",
      course_count: 3,
      lecture_count: 180,
      courses: [
        {
          code: "12.001", display_name: "MIT 12.001 \u2014 Introduction to Geology",
          lecture_count: 26,
          lectures: [
            { video_id: "o96jSo3hcFg", title: "Lec 1 | MIT 12.001 Introduction to Geology, Fall 2013", url: "https://www.youtube.com/watch?v=o96jSo3hcFg", duration: 3120, view_count: 420000, subject: "Earth & Environmental Sciences", course_code: "12.001" },
          ]
        },
      ]
    },
    {
      name: "Humanities & Arts",
      icon: "\uD83D\uDCD6",
      course_count: 8,
      lecture_count: 540,
      courses: [
        {
          code: "24.261", display_name: "MIT 24.261 \u2014 Philosophy of Love in the Western World",
          lecture_count: 12,
          lectures: [
            { video_id: "4AL95TcwXQc", title: "Session 1 | 24.261 Philosophy of Love in the Western World", url: "https://www.youtube.com/watch?v=4AL95TcwXQc", duration: 3600, view_count: 67707, subject: "Humanities & Arts", course_code: "24.261" },
            { video_id: "FF4LeK2D0co", title: "Session 4 | 24.261 Philosophy of Love in the Western World", url: "https://www.youtube.com/watch?v=FF4LeK2D0co", duration: 3400, view_count: 20026, subject: "Humanities & Arts", course_code: "24.261" },
          ]
        },
        {
          code: "21L.011", display_name: "MIT 21L.011 \u2014 The Film Experience",
          lecture_count: 24,
          lectures: [
            { video_id: "LFOsw1Vccac", title: "1. Introduction to MIT 21L.011 The Film Experience (2007)", url: "https://www.youtube.com/watch?v=LFOsw1Vccac", duration: 3080, view_count: 221530, subject: "Humanities & Arts", course_code: "21L.011" },
            { video_id: "CMmB8KtbT1U", title: "1. Introduction (21L.011 The Film Experience)", url: "https://www.youtube.com/watch?v=CMmB8KtbT1U", duration: 3334, view_count: 61077, subject: "Humanities & Arts", course_code: "21L.011" },
          ]
        },
      ]
    },
  ];

  // Build a flat lecture index for search
  const ALL_LECTURES = [];
  const LECTURE_BY_ID = {};
  MOCK_SUBJECTS.forEach(s => {
    s.courses.forEach(c => {
      c.lectures.forEach(l => {
        ALL_LECTURES.push(l);
        LECTURE_BY_ID[l.video_id] = l;
      });
    });
  });

  // ── Toast Notifications ─────────────────────────────────────
  function toast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  // ── Demo Modal ──────────────────────────────────────────────
  function showDemoModal(feature, icon) {
    const modal = document.getElementById('demo-modal');
    document.getElementById('demo-modal-icon').textContent = icon || '\uD83E\uDD16';
    document.getElementById('demo-modal-title').textContent = feature || 'AI Feature';
    document.getElementById('demo-modal-body').innerHTML =
      'In the <strong>full AXAM app</strong>, this is where the AI model would respond ' +
      'using a local LLM running on your machine.' +
      '<br><br>' +
      'This demo doesn\u2019t include AI models because <strong>AXAM is designed to run ' +
      '100% offline</strong> on your PC \u2014 the models are bundled with the desktop installer ' +
      'and never need internet.' +
      '<br><br>' +
      '<span style="color:var(--text-muted);font-size:13px;">' +
      'The full package includes 3 LLM tiers (Gemma 3 4B, Gemma 2 2B, Qwen 2.5 1.5B) ' +
      'that auto-select based on your hardware.</span>';
    modal.classList.remove('hidden');
  }

  function closeDemoModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('demo-modal').classList.add('hidden');
  }

  // ── Navigation ──────────────────────────────────────────────
  function navigate(page) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
    document.querySelectorAll('.page').forEach(el => {
      el.classList.toggle('active', el.id === `page-${page}`);
    });
    currentPage = page;

    if (page === 'browse' && typeof BrowseModule !== 'undefined') {
      BrowseModule.init();
    }
    if (page === 'exam' && typeof ExamModule !== 'undefined') {
      ExamModule.init();
    }
  }

  // ── Home Search ─────────────────────────────────────────────
  function homeSearch() {
    const q = document.getElementById('home-search-input').value.trim();
    if (!q) return;
    if (q.includes('?') || q.split(' ').length > 4) {
      navigate('chat');
      if (typeof ChatModule !== 'undefined') {
        ChatModule.sendMessage(q);
      }
    } else {
      navigate('browse');
      if (typeof BrowseModule !== 'undefined') {
        BrowseModule.searchFromHome(q);
      }
    }
  }

  // ── Populate Home Subjects ──────────────────────────────────
  function loadHomeSubjects() {
    const container = document.getElementById('home-subjects');
    if (!container) return;
    container.innerHTML = MOCK_SUBJECTS.map(s => {
      const safeName = s.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
      return `
      <div class="card card-clickable subject-card"
           onclick="AXAM.navigate('browse'); BrowseModule.showCourses('${safeName}')">
        <div class="subject-icon">${s.icon}</div>
        <div class="subject-name">${esc(s.name)}</div>
        <div class="subject-meta">${s.lecture_count} lectures \u00B7 ${s.course_count} courses</div>
      </div>
    `}).join('');
  }

  // ── Model Picker ────────────────────────────────────────────
  const MODELS = [
    { key: 'gemma3-4b', name: 'Gemma 3 4B', tier: 1, requires_gpu: true, speed: '1-3s (GPU)', desc: 'Best quality \u2014 GPU with 4+ GB VRAM' },
    { key: 'gemma2-2b', name: 'Gemma 2 2B', tier: 2, requires_gpu: false, speed: '2-4s (CPU)', desc: 'Mid-range \u2014 GPU or CPU, 8+ GB RAM' },
    { key: 'qwen25-1.5b', name: 'Qwen 2.5 1.5B', tier: 3, requires_gpu: false, speed: '3-5s (CPU)', desc: 'Fastest \u2014 runs on low-end machines' },
  ];
  let activeModel = 'gemma2-2b';

  function initModelPicker() {
    const select = document.getElementById('model-select');
    select.innerHTML = MODELS.map(m =>
      `<option value="${m.key}"${m.key === activeModel ? ' selected' : ''}>T${m.tier}: ${m.name}</option>`
    ).join('');
    select.disabled = false;
    select.addEventListener('change', function() {
      switchModel(this.value);
    });
    updateModelInfo(activeModel);
  }

  function switchModel(key) {
    activeModel = key;
    updateModelInfo(key);
    const m = MODELS.find(x => x.key === key);
    toast(`Switched to ${m.name} (demo mode \u2014 models load in the full app)`, 'info');
  }

  function updateModelInfo(key) {
    const infoEl = document.getElementById('model-info');
    const m = MODELS.find(x => x.key === key);
    if (!m || !infoEl) return;
    infoEl.innerHTML =
      `<span class="model-speed">${m.speed}</span>` +
      `<span class="model-hw">${m.desc}</span>`;
  }

  // ── Format helpers ──────────────────────────────────────────
  function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return '\u2014';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
  }

  function formatViews(count) {
    if (!count) return '\u2014';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toLocaleString();
  }

  // ── Escape HTML ─────────────────────────────────────────────
  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Init ────────────────────────────────────────────────────
  function init() {
    loadHomeSubjects();
    initModelPicker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    navigate,
    homeSearch,
    switchModel,
    toast,
    showDemoModal,
    closeDemoModal,
    formatDuration,
    formatViews,
    esc,
    MOCK_SUBJECTS,
    ALL_LECTURES,
    LECTURE_BY_ID,
    get currentPage() { return currentPage; },
  };
})();
