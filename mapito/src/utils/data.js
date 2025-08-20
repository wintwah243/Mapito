// Available roadmap suggestions
  export const roadmapSuggestions = [
    "AI Engineer",
    "Business Analyst",
    "Data Scientist",
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "QA Engineer",
    "Cloud Engineer",
    "Cybersecurity Specialist",
    "Blockchain Developer",
    "Mobile App Developer",
    "UIUX Designer",
    "Data Analyst",
    "Project Manager",
    "Game Developer",
    "Software Developer",
    "Web Developer",
    "Full Stack Developer",
    "UI Designer",
    "UX Designer",
    "Solution Architect",
    "Data Engineer",
    "Android Developer",
    "IOS Developer",
    "Software Architect",
    "IT techinician",
    "Network Engineer",
    "System Engineer",
  ];

//for quiz feature
export const quizData = {
  beginner: {
    javascript: [
      {
        question: "What is the output of `console.log(2 + '2')` in JavaScript?",
        options: ["4", "'22'", "22", "Error"],
        answer: "'22'"
      },
      {
        question: "Which of the following is used to declare a variable in JavaScript?",
        options: ["let", "var", "const", "All of the above"],
        answer: "All of the above"
      },
      {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["//", "#", "<!--", "/* */"],
        answer: "//"
      },
      {
        question: "What does `typeof null` return in JavaScript?",
        options: ["null", "object", "undefined", "number"],
        answer: "object"
      },
      {
        question: "Which method adds an element to the end of an array?",
        options: [".push()", ".pop()", ".shift()", ".unshift()"],
        answer: ".push()"
      }
    ],
    python: [
      {
        question: "What is the correct file extension for Python files?",
        options: [".pt", ".pyth", ".pyt", ".py"],
        answer: ".py"
      },
      {
        question: "Which keyword is used to define a function in Python?",
        options: ["function", "def", "fun", "define"],
        answer: "def"
      },
      {
        question: "What is the output of `print(type([]))` in Python?",
        options: ["<class 'list'>", "<type 'list'>", "list", "error"],
        answer: "<class 'list'>"
      },
      {
        question: "Which of these is a mutable data type in Python?",
        options: ["Tuple", "String", "List", "Integer"],
        answer: "List"
      },
      {
        question: "What is used to handle exceptions in Python?",
        options: ["catch", "try-except", "try-catch", "throw"],
        answer: "try-except"
      }
    ],
    html: [
      {
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language",
          "None of the above"
        ],
        answer: "Hyper Text Markup Language"
      },
      {
        question: "Which tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<hyperlink>"],
        answer: "<a>"
      },
      {
        question: "Which tag is used to define an image?",
        options: ["<img>", "<image>", "<picture>", "<src>"],
        answer: "<img>"
      },
      {
        question: "Which attribute specifies an alternate text for an image?",
        options: ["src", "alt", "title", "href"],
        answer: "alt"
      },
      {
        question: "Which tag is used to define a table row?",
        options: ["<td>", "<tr>", "<th>", "<table-row>"],
        answer: "<tr>"
      }
    ],
    css: [
      {
        question: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Creative Style Sheets",
          "Cascading Style Sheets",
          "Colorful Style Sheets"
        ],
        answer: "Cascading Style Sheets"
      },
      {
        question: "Which property is used to change the text color?",
        options: ["text-color", "font-color", "color", "text-style"],
        answer: "color"
      },
      {
        question: "How do you select an element with id 'demo'?",
        options: [".demo", "#demo", "*demo", "demo"],
        answer: "#demo"
      },
      {
        question: "Which property is used to change the font?",
        options: ["font-family", "font-style", "font-weight", "text-font"],
        answer: "font-family"
      },
      {
        question: "How do you make a list display horizontally?",
        options: [
          "list-style: horizontal;",
          "display: inline;",
          "display: flex;",
          "list-type: inline;"
        ],
        answer: "display: flex;"
      }
    ],
    git: [
      {
        question: "What command initializes a new Git repository?",
        options: ["git init", "git start", "git new", "git create"],
        answer: "git init"
      },
      {
        question: "Which command shows the status of your working directory?",
        options: ["git status", "git show", "git info", "git log"],
        answer: "git status"
      },
      {
        question: "How do you add all changed files to staging?",
        options: ["git add .", "git add all", "git add *", "git stage ."],
        answer: "git add ."
      },
      {
        question: "Which command commits your changes?",
        options: [
          "git save",
          "git commit",
          "git snapshot",
          "git save -m 'message'"
        ],
        answer: "git commit"
      },
      {
        question: "How do you push changes to a remote repository?",
        options: [
          "git push",
          "git upload",
          "git send",
          "git push origin master"
        ],
        answer: "git push origin master"
      }
    ],
    cli: [
      {
        question: "Which command lists directory contents?",
        options: ["list", "dir", "ls", "show"],
        answer: "ls"
      },
      {
        question: "How do you create a new directory?",
        options: ["mkdir", "newdir", "createdir", "md"],
        answer: "mkdir"
      },
      {
        question: "Which command shows your current directory?",
        options: ["cwd", "where", "pwd", "curdir"],
        answer: "pwd"
      },
      {
        question: "How do you remove a file?",
        options: ["delete", "rm", "remove", "del"],
        answer: "rm"
      },
      {
        question: "Which command moves or renames files?",
        options: ["move", "mv", "rename", "change"],
        answer: "mv"
      }
    ]
  },
  intermediate: {
    react: [
      {
        question: "What is the purpose of React's `useState` hook?",
        options: [
          "To manage component state",
          "To fetch data from an API",
          "To create components",
          "To handle routing"
        ],
        answer: "To manage component state"
      },
      {
        question: "Which of the following is the correct syntax for using `useEffect` in React?",
        options: [
          "useEffect(() => {})",
          "useEffect({})",
          "useEffect([])",
          "useEffect()"
        ],
        answer: "useEffect(() => {})"
      },
      {
        question: "What does JSX stand for in React?",
        options: ["JavaScript XML", "JavaScript Extension", "JavaXScript", "None of the above"],
        answer: "JavaScript XML"
      },
      {
        question: "What is the virtual DOM in React?",
        options: [
          "A copy of the actual DOM that React uses to optimize updates",
          "A template engine",
          "A browser API",
          "An external library"
        ],
        answer: "A copy of the actual DOM that React uses to optimize updates"
      },
      {
        question: "Which method is used to pass data from parent to child in React?",
        options: ["Props", "State", "Context", "Redux"],
        answer: "Props"
      }
    ],
    node: [
      {
        question: "What is Node.js?",
        options: [
          "A JavaScript framework",
          "A JavaScript runtime built on Chrome's V8 engine",
          "A programming language",
          "A database"
        ],
        answer: "A JavaScript runtime built on Chrome's V8 engine"
      },
      {
        question: "Which module is used to create a web server in Node.js?",
        options: ["http", "server", "web", "express"],
        answer: "http"
      },
      {
        question: "What does npm stand for?",
        options: [
          "Node Package Manager",
          "Node Project Manager",
          "New Package Module",
          "Node Program Manager"
        ],
        answer: "Node Package Manager"
      },
      {
        question: "Which function is used to include modules in Node.js?",
        options: ["include()", "require()", "import()", "use()"],
        answer: "require()"
      },
      {
        question: "Which global object holds module information in Node.js?",
        options: ["module", "exports", "global", "process"],
        answer: "module"
      }
    ],
    typescript: [
      {
        question: "What is TypeScript?",
        options: [
          "A superset of JavaScript",
          "A new programming language",
          "A JavaScript framework",
          "A database"
        ],
        answer: "A superset of JavaScript"
      },
      {
        question: "Which command compiles TypeScript to JavaScript?",
        options: ["tsc", "typescript", "compile-ts", "ts-compile"],
        answer: "tsc"
      },
      {
        question: "How do you define a type in TypeScript?",
        options: ["type", "interface", "Both type and interface", "class"],
        answer: "Both type and interface"
      },
      {
        question: "Which symbol is used for type assertions in TypeScript?",
        options: ["<>", "as", "Both <> and as", ":"],
        answer: "Both <> and as"
      },
      {
        question: "What is the type of `let x = 5` in TypeScript?",
        options: ["any", "number", "int", "var"],
        answer: "number"
      }
    ],
    express: [
      {
        question: "What is Express.js?",
        options: [
          "A frontend framework",
          "A Node.js web application framework",
          "A database",
          "A programming language"
        ],
        answer: "A Node.js web application framework"
      },
      {
        question: "Which method is used to handle GET requests in Express?",
        options: ["app.get()", "app.post()", "app.use()", "app.handleGet()"],
        answer: "app.get()"
      },
      {
        question: "What does middleware do in Express?",
        options: [
          "Handles requests and responses",
          "Connects to databases",
          "Renders views",
          "All of the above"
        ],
        answer: "Handles requests and responses"
      },
      {
        question: "How do you start an Express server?",
        options: [
          "app.start()",
          "app.run()",
          "app.listen()",
          "app.begin()"
        ],
        answer: "app.listen()"
      },
      {
        question: "Which method is used to serve static files in Express?",
        options: [
          "app.static()",
          "express.static()",
          "app.useStatic()",
          "express.files()"
        ],
        answer: "express.static()"
      }
    ],
    mongodb: [
      {
        question: "What is MongoDB?",
        options: [
          "A relational database",
          "A NoSQL database",
          "A graph database",
          "A key-value store"
        ],
        answer: "A NoSQL database"
      },
      {
        question: "Which format does MongoDB use to store data?",
        options: ["JSON", "BSON", "XML", "CSV"],
        answer: "BSON"
      },
      {
        question: "What is a collection in MongoDB?",
        options: [
          "Equivalent to a table in relational databases",
          "A group of databases",
          "A query result",
          "A backup"
        ],
        answer: "Equivalent to a table in relational databases"
      },
      {
        question: "Which operator is used to update documents in MongoDB?",
        options: ["$set", "$update", "$change", "$modify"],
        answer: "$set"
      },
      {
        question: "Which method finds documents in MongoDB?",
        options: ["find()", "search()", "query()", "get()"],
        answer: "find()"
      }
    ],
    sql: [
      {
        question: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Query Language",
          "Standard Query Language",
          "Sequential Query Language"
        ],
        answer: "Structured Query Language"
      },
      {
        question: "Which clause filters records in SQL?",
        options: ["FILTER", "WHERE", "HAVING", "CONDITION"],
        answer: "WHERE"
      },
      {
        question: "Which keyword selects all columns from a table?",
        options: ["ALL", "*", "EVERYTHING", "COLUMNS"],
        answer: "*"
      },
      {
        question: "Which function returns the number of rows?",
        options: ["NUMBER()", "COUNT()", "SUM()", "TOTAL()"],
        answer: "COUNT()"
      },
      {
        question: "Which keyword eliminates duplicate rows?",
        options: ["UNIQUE", "DISTINCT", "DIFFERENT", "ONCE"],
        answer: "DISTINCT"
      }
    ]
  },
  advanced: {
    docker: [
      {
        question: "What is Docker?",
        options: [
          "A virtualization platform",
          "A containerization platform",
          "A programming language",
          "A cloud service"
        ],
        answer: "A containerization platform"
      },
      {
        question: "Which command builds a Docker image?",
        options: [
          "docker build",
          "docker create",
          "docker make",
          "docker image"
        ],
        answer: "docker build"
      },
      {
        question: "What is a Dockerfile?",
        options: [
          "A text file containing Docker commands",
          "A Docker container",
          "A Docker image",
          "A Docker network"
        ],
        answer: "A text file containing Docker commands"
      },
      {
        question: "Which command runs a Docker container?",
        options: [
          "docker start",
          "docker run",
          "docker execute",
          "docker container"
        ],
        answer: "docker run"
      },
      {
        question: "What is Docker Compose used for?",
        options: [
          "Defining and running multi-container applications",
          "Building single containers",
          "Managing Docker images",
          "Creating Docker networks"
        ],
        answer: "Defining and running multi-container applications"
      }
    ],
    kubernetes: [
      {
        question: "What is Kubernetes?",
        options: [
          "A containerization platform",
          "A container orchestration system",
          "A programming language",
          "A cloud provider"
        ],
        answer: "A container orchestration system"
      },
      {
        question: "What is the smallest deployable unit in Kubernetes?",
        options: ["Container", "Pod", "Node", "Cluster"],
        answer: "Pod"
      },
      {
        question: "Which command deploys an application in Kubernetes?",
        options: ["kubectl run", "kubectl deploy", "kubectl start", "kubectl create"],
        answer: "kubectl run"
      },
      {
        question: "What manages pods in Kubernetes?",
        options: ["Node", "Deployment", "Cluster", "Service"],
        answer: "Deployment"
      },
      {
        question: "Which component is the Kubernetes master?",
        options: ["kubelet", "kube-proxy", "kube-apiserver", "kube-scheduler"],
        answer: "kube-apiserver"
      }
    ],
    aws: [
      {
        question: "What does AWS stand for?",
        options: [
          "Amazon Web Services",
          "Advanced Web Systems",
          "Automated Web Solutions",
          "Application Web Services"
        ],
        answer: "Amazon Web Services"
      },
      {
        question: "Which service provides virtual servers in AWS?",
        options: ["EC2", "S3", "Lambda", "RDS"],
        answer: "EC2"
      },
      {
        question: "Which service provides object storage in AWS?",
        options: ["EC2", "S3", "EBS", "EFS"],
        answer: "S3"
      },
      {
        question: "What is AWS Lambda?",
        options: [
          "A serverless compute service",
          "A database service",
          "A networking service",
          "A storage service"
        ],
        answer: "A serverless compute service"
      },
      {
        question: "Which service is used for content delivery in AWS?",
        options: ["Route 53", "CloudFront", "API Gateway", "ELB"],
        answer: "CloudFront"
      }
    ],
    graphql: [
      {
        question: "What is GraphQL?",
        options: [
          "A database",
          "A query language for APIs",
          "A programming language",
          "A frontend framework"
        ],
        answer: "A query language for APIs"
      },
      {
        question: "Which operation retrieves data in GraphQL?",
        options: ["query", "mutation", "subscription", "get"],
        answer: "query"
      },
      {
        question: "Which operation modifies data in GraphQL?",
        options: ["query", "mutation", "subscription", "post"],
        answer: "mutation"
      },
      {
        question: "What is a resolver in GraphQL?",
        options: [
          "A function that resolves a query to data",
          "A type definition",
          "A schema validator",
          "A database connection"
        ],
        answer: "A function that resolves a query to data"
      },
      {
        question: "Which tool provides a UI for GraphQL APIs?",
        options: ["GraphiQL", "Postman", "Swagger", "Insomnia"],
        answer: "GraphiQL"
      }
    ],
    ml: [
      {
        question: "What is machine learning?",
        options: [
          "A type of hard-coded algorithm",
          "A process of manually labeling data",
          "A subset of AI where systems learn from data",
          "A way to build websites"
        ],
        answer: "A subset of AI where systems learn from data"
      },
      {
        question: "Which of the following is a popular machine learning library in Python?",
        options: ["NumPy", "Pandas", "Scikit-learn", "Flask"],
        answer: "Scikit-learn"
      },
      {
        question: "What does 'training a model' mean in ML?",
        options: [
          "Giving a model a name",
          "Writing code to define a model",
          "Feeding data to a model to learn patterns",
          "Running the model in production"
        ],
        answer: "Feeding data to a model to learn patterns"
      },
      {
        question: "What is supervised learning?",
        options: [
          "Learning with labeled data",
          "Learning without data",
          "Learning without feedback",
          "Learning with reinforcement"
        ],
        answer: "Learning with labeled data"
      },
      {
        question: "Which algorithm is commonly used for classification problems?",
        options: ["K-means", "Linear Regression", "Decision Trees", "PCA"],
        answer: "Decision Trees"
      }
    ],
    blockchain: [
      {
        question: "What is a blockchain?",
        options: [
          "A centralized database",
          "A distributed ledger",
          "A programming language",
          "A cloud storage system"
        ],
        answer: "A distributed ledger"
      },
      {
        question: "Which cryptocurrency first implemented blockchain?",
        options: ["Ethereum", "Bitcoin", "Litecoin", "Ripple"],
        answer: "Bitcoin"
      },
      {
        question: "What is a smart contract?",
        options: [
          "A legal document",
          "Self-executing code on a blockchain",
          "A cryptocurrency wallet",
          "A blockchain explorer"
        ],
        answer: "Self-executing code on a blockchain"
      },
      {
        question: "What is mining in blockchain?",
        options: [
          "Creating new blocks and validating transactions",
          "Storing data on the blockchain",
          "Developing blockchain applications",
          "Buying cryptocurrency"
        ],
        answer: "Creating new blocks and validating transactions"
      },
      {
        question: "Which consensus mechanism does Bitcoin use?",
        options: [
          "Proof of Stake",
          "Proof of Work",
          "Delegated Proof of Stake",
          "Proof of Authority"
        ],
        answer: "Proof of Work"
      }
    ]
  }
};
