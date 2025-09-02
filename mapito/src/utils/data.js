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
    },
    {
      question: "Which keyword is used to stop a loop?",
      options: ["exit", "stop", "break", "return"],
      answer: "break"
    },
    {
      question: "What is the default value of an uninitialized variable?",
      options: ["0", "null", "undefined", "empty string"],
      answer: "undefined"
    },
    {
      question: "Which operator is used for strict equality?",
      options: ["==", "===", "!=", "!=="],
      answer: "==="
    },
    {
      question: "What does `NaN` stand for?",
      options: ["No available number", "Not a Number", "Null and None", "New assigned number"],
      answer: "Not a Number"
    },
    {
      question: "Which built-in method converts a JSON string to an object?",
      options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "parse.JSON()"],
      answer: "JSON.parse()"
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
    },
    {
      question: "Which function is used to get user input?",
      options: ["input()", "scan()", "read()", "get()"],
      answer: "input()"
    },
    {
      question: "What is the keyword to exit a loop?",
      options: ["stop", "end", "exit", "break"],
      answer: "break"
    },
    {
      question: "Which operator is used for exponentiation?",
      options: ["^", "**", "pow", "//"],
      answer: "**"
    },
    {
      question: "What does `len('hello')` return?",
      options: ["5", "4", "6", "error"],
      answer: "5"
    },
    {
      question: "Which keyword is used to create a class in Python?",
      options: ["define", "class", "struct", "type"],
      answer: "class"
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
    },
    {
      question: "Which tag is used to create a numbered list?",
      options: ["<ol>", "<ul>", "<li>", "<list>"],
      answer: "<ol>"
    },
    {
      question: "Which tag is used for the largest heading?",
      options: ["<h1>", "<h6>", "<head>", "<heading>"],
      answer: "<h1>"
    },
    {
      question: "Which tag is used to add a line break?",
      options: ["<break>", "<br>", "<lb>", "<newline>"],
      answer: "<br>"
    },
    {
      question: "Which attribute is used to open a link in a new tab?",
      options: ["target='_self'", "target='_blank'", "newtab", "window='new'"],
      answer: "target='_blank'"
    },
    {
      question: "Which tag is used to create a checkbox?",
      options: ["<checkbox>", "<input type='box'>", "<check>", "<input type='checkbox'>"],
      answer: "<input type='checkbox'>"
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
    },
    {
      question: "Which property is used to change background color?",
      options: ["background-color", "bgcolor", "color-background", "bg-color"],
      answer: "background-color"
    },
    {
      question: "Which property controls the size of text?",
      options: ["text-size", "font-size", "size", "text-style"],
      answer: "font-size"
    },
    {
      question: "How do you make text bold?",
      options: ["font-weight: bold;", "text-style: bold;", "style: bold;", "font: bold;"],
      answer: "font-weight: bold;"
    },
    {
      question: "Which property adds space inside an element?",
      options: ["margin", "padding", "spacing", "border"],
      answer: "padding"
    },
    {
      question: "Which unit is relative to the root element's font size?",
      options: ["em", "px", "%", "rem"],
      answer: "rem"
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
    },
    {
      question: "Which command creates a new branch?",
      options: ["git new branch", "git branch", "git checkout", "git switch"],
      answer: "git branch"
    },
    {
      question: "Which command is used to merge branches?",
      options: ["git combine", "git merge", "git join", "git attach"],
      answer: "git merge"
    },
    {
      question: "Which command shows commit history?",
      options: ["git history", "git log", "git show", "git commits"],
      answer: "git log"
    },
    {
      question: "Which file is used to ignore files in Git?",
      options: [".gitignore", ".gitconfig", "ignore.txt", "gitignore.json"],
      answer: ".gitignore"
    },
    {
      question: "Which command clones a remote repository?",
      options: ["git copy", "git clone", "git fetch", "git download"],
      answer: "git clone"
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
    },
    {
      question: "Which command clears the terminal screen?",
      options: ["clear", "cls", "reset", "clean"],
      answer: "clear"
    },
    {
      question: "Which command shows the first lines of a file?",
      options: ["head", "top", "start", "show"],
      answer: "head"
    },
    {
      question: "Which command shows the last lines of a file?",
      options: ["tail", "end", "bottom", "last"],
      answer: "tail"
    },
    {
      question: "Which command copies files?",
      options: ["cp", "copy", "duplicate", "cfile"],
      answer: "cp"
    },
    {
      question: "Which command is used to change directory?",
      options: ["cd", "chdir", "move", "dir"],
      answer: "cd"
    }
  ]
},
  intermediate: {
  react: [
    {
      question: "What is the purpose of React's `useState` hook?",
      options: ["To manage component state", "To fetch data from an API", "To create components", "To handle routing"],
      answer: "To manage component state"
    },
    {
      question: "Which of the following is the correct syntax for using `useEffect` in React?",
      options: ["useEffect(() => {})", "useEffect({})", "useEffect([])", "useEffect()"],
      answer: "useEffect(() => {})"
    },
    {
      question: "What does JSX stand for in React?",
      options: ["JavaScript XML", "JavaScript Extension", "JavaXScript", "None of the above"],
      answer: "JavaScript XML"
    },
    {
      question: "What is the virtual DOM in React?",
      options: ["A copy of the actual DOM that React uses to optimize updates", "A template engine", "A browser API", "An external library"],
      answer: "A copy of the actual DOM that React uses to optimize updates"
    },
    {
      question: "Which method is used to pass data from parent to child in React?",
      options: ["Props", "State", "Context", "Redux"],
      answer: "Props"
    },
    {
      question: "What does React.StrictMode do?",
      options: ["Checks for potential problems in code", "Adds strict CSS rules", "Optimizes rendering", "Enforces TypeScript types"],
      answer: "Checks for potential problems in code"
    },
    {
      question: "What is the difference between `useMemo` and `useCallback`?",
      options: ["useMemo memoizes values, useCallback memoizes functions", "Both are identical", "useMemo is for API calls, useCallback is for rendering", "None of the above"],
      answer: "useMemo memoizes values, useCallback memoizes functions"
    },
    {
      question: "Which hook is used for accessing context in React?",
      options: ["useContext", "useReducer", "useEffect", "useState"],
      answer: "useContext"
    },
    {
      question: "What does `React.Fragment` do?",
      options: ["Groups multiple elements without adding extra DOM nodes", "Adds styling", "Handles API calls", "Stores state"],
      answer: "Groups multiple elements without adding extra DOM nodes"
    },
    {
      question: "Which lifecycle method does `useEffect` replicate by default?",
      options: ["componentDidMount", "componentDidUpdate", "Both componentDidMount and componentDidUpdate", "componentWillUnmount"],
      answer: "Both componentDidMount and componentDidUpdate"
    }
  ],

  node: [
    {
      question: "What is Node.js?",
      options: ["A JavaScript framework", "A JavaScript runtime built on Chrome's V8 engine", "A programming language", "A database"],
      answer: "A JavaScript runtime built on Chrome's V8 engine"
    },
    {
      question: "Which module is used to create a web server in Node.js?",
      options: ["http", "server", "web", "express"],
      answer: "http"
    },
    {
      question: "What does npm stand for?",
      options: ["Node Package Manager", "Node Project Manager", "New Package Module", "Node Program Manager"],
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
    },
    {
      question: "Which method is used to read files in Node.js?",
      options: ["fs.readFile()", "file.read()", "fs.getFile()", "read.file()"],
      answer: "fs.readFile()"
    },
    {
      question: "What is the default scope of variables in Node.js?",
      options: ["Function scope", "Block scope", "Global scope", "Module scope"],
      answer: "Module scope"
    },
    {
      question: "Which object provides information about the current Node.js process?",
      options: ["process", "module", "system", "info"],
      answer: "process"
    },
    {
      question: "What does `eventEmitter.on()` do?",
      options: ["Registers an event listener", "Removes an event listener", "Emits an event", "Closes a connection"],
      answer: "Registers an event listener"
    },
    {
      question: "What is the default file extension if you require a module without specifying one?",
      options: [".js", ".json", ".node", "All of the above"],
      answer: ".js"
    }
  ],

  typescript: [
    {
      question: "What is TypeScript?",
      options: ["A superset of JavaScript", "A new programming language", "A JavaScript framework", "A database"],
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
    },
    {
      question: "What is the purpose of `tsconfig.json`?",
      options: ["Configure TypeScript compiler options", "Store environment variables", "Run scripts", "Define database settings"],
      answer: "Configure TypeScript compiler options"
    },
    {
      question: "Which keyword creates a readonly property in TypeScript?",
      options: ["const", "readonly", "static", "immutable"],
      answer: "readonly"
    },
    {
      question: "What are union types in TypeScript?",
      options: ["Types that combine multiple types", "Types used only in classes", "Types for arrays only", "Types for functions only"],
      answer: "Types that combine multiple types"
    },
    {
      question: "Which operator checks for both value and type in TypeScript?",
      options: ["==", "===", "is", "typeof"],
      answer: "==="
    },
    {
      question: "How do you specify optional properties in interfaces?",
      options: ["property?", "optional property", "property:optional", "None of the above"],
      answer: "property?"
    }
  ],

  express: [
    {
      question: "What is Express.js?",
      options: ["A frontend framework", "A Node.js web application framework", "A database", "A programming language"],
      answer: "A Node.js web application framework"
    },
    {
      question: "Which method is used to handle GET requests in Express?",
      options: ["app.get()", "app.post()", "app.use()", "app.handleGet()"],
      answer: "app.get()"
    },
    {
      question: "What does middleware do in Express?",
      options: ["Handles requests and responses", "Connects to databases", "Renders views", "All of the above"],
      answer: "Handles requests and responses"
    },
    {
      question: "How do you start an Express server?",
      options: ["app.start()", "app.run()", "app.listen()", "app.begin()"],
      answer: "app.listen()"
    },
    {
      question: "Which method is used to serve static files in Express?",
      options: ["app.static()", "express.static()", "app.useStatic()", "express.files()"],
      answer: "express.static()"
    },
    {
      question: "Which object represents the HTTP request in Express?",
      options: ["req", "res", "request", "response"],
      answer: "req"
    },
    {
      question: "Which method handles POST requests?",
      options: ["app.post()", "app.send()", "app.use()", "app.push()"],
      answer: "app.post()"
    },
    {
      question: "How do you define route parameters in Express?",
      options: ["/user/:id", "/user?id", "/user/{id}", "/user[id]"],
      answer: "/user/:id"
    },
    {
      question: "What is `next()` used for in middleware?",
      options: ["Moves control to the next middleware", "Ends the request", "Sends response", "None of the above"],
      answer: "Moves control to the next middleware"
    },
    {
      question: "Which method is used to return JSON data in Express?",
      options: ["res.json()", "res.sendJSON()", "res.return()", "res.send()"],
      answer: "res.json()"
    }
  ],

  mongodb: [
    {
      question: "What is MongoDB?",
      options: ["A relational database", "A NoSQL database", "A graph database", "A key-value store"],
      answer: "A NoSQL database"
    },
    {
      question: "Which format does MongoDB use to store data?",
      options: ["JSON", "BSON", "XML", "CSV"],
      answer: "BSON"
    },
    {
      question: "What is a collection in MongoDB?",
      options: ["Equivalent to a table in relational databases", "A group of databases", "A query result", "A backup"],
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
    },
    {
      question: "Which command inserts one document?",
      options: ["insertOne()", "add()", "insert()", "createDoc()"],
      answer: "insertOne()"
    },
    {
      question: "Which method removes documents?",
      options: ["deleteOne()", "remove()", "delete()", "drop()"],
      answer: "deleteOne()"
    },
    {
      question: "What does `_id` represent in MongoDB?",
      options: ["Primary key for each document", "Database name", "Collection name", "A backup ID"],
      answer: "Primary key for each document"
    },
    {
      question: "Which command creates an index in MongoDB?",
      options: ["createIndex()", "makeIndex()", "addIndex()", "index()"],
      answer: "createIndex()"
    },
    {
      question: "Which aggregation stage groups documents?",
      options: ["$group", "$sum", "$aggregate", "$match"],
      answer: "$group"
    }
  ],

  sql: [
    {
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"],
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
    },
    {
      question: "Which SQL statement updates data in a table?",
      options: ["UPDATE", "MODIFY", "CHANGE", "ALTER"],
      answer: "UPDATE"
    },
    {
      question: "Which SQL clause is used to group rows?",
      options: ["GROUP BY", "ORDER BY", "SORT BY", "CLUSTER BY"],
      answer: "GROUP BY"
    },
    {
      question: "Which SQL function calculates the average?",
      options: ["SUM()", "MEAN()", "AVG()", "AVERAGE()"],
      answer: "AVG()"
    },
    {
      question: "Which command deletes all rows but keeps the structure?",
      options: ["TRUNCATE", "DELETE", "DROP", "CLEAR"],
      answer: "TRUNCATE"
    },
    {
      question: "Which constraint ensures column values are unique?",
      options: ["UNIQUE", "PRIMARY KEY", "NOT NULL", "CHECK"],
      answer: "UNIQUE"
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
      options: ["docker build", "docker create", "docker make", "docker image"],
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
    },
    // extra 5
    {
      question: "Which command lists all running containers?",
      options: ["docker ps", "docker list", "docker show", "docker status"],
      answer: "docker ps"
    },
    {
      question: "Which command removes a Docker image?",
      options: [
        "docker rmi <image_id>",
        "docker remove <image_id>",
        "docker delete <image_id>",
        "docker image rm <image_id>"
      ],
      answer: "docker rmi <image_id>"
    },
    {
      question: "What is the difference between Docker image and container?",
      options: [
        "Image is a template, container is a running instance",
        "Image is running, container is static",
        "Both are the same",
        "Image is for networking, container is for storage"
      ],
      answer: "Image is a template, container is a running instance"
    },
    {
      question: "Which command copies files between host and container?",
      options: ["docker copy", "docker cp", "docker transfer", "docker mv"],
      answer: "docker cp"
    },
    {
      question: "What is the default Docker network driver?",
      options: ["bridge", "overlay", "host", "macvlan"],
      answer: "bridge"
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
    },
    // extra 5
    {
      question: "Which object exposes a set of Pods as a network service?",
      options: ["Service", "Ingress", "Deployment", "ReplicaSet"],
      answer: "Service"
    },
    {
      question: "Which command shows all pods in Kubernetes?",
      options: ["kubectl get pods", "kubectl show pods", "kubectl list pods", "kubectl pods"],
      answer: "kubectl get pods"
    },
    {
      question: "What is a Kubernetes namespace used for?",
      options: [
        "Logical separation of resources",
        "Defining storage volumes",
        "Scheduling pods",
        "Scaling nodes"
      ],
      answer: "Logical separation of resources"
    },
    {
      question: "Which Kubernetes component runs on every node?",
      options: ["kubelet", "etcd", "controller-manager", "apiserver"],
      answer: "kubelet"
    },
    {
      question: "Which object manages horizontal scaling of pods?",
      options: ["HPA (Horizontal Pod Autoscaler)", "Deployment", "ReplicaSet", "StatefulSet"],
      answer: "HPA (Horizontal Pod Autoscaler)"
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
    },
    // extra 5
    {
      question: "Which AWS service is used for relational databases?",
      options: ["RDS", "DynamoDB", "S3", "Aurora"],
      answer: "RDS"
    },
    {
      question: "Which AWS service is a fully managed NoSQL database?",
      options: ["DynamoDB", "RDS", "Redshift", "Aurora"],
      answer: "DynamoDB"
    },
    {
      question: "Which service is used for monitoring AWS resources?",
      options: ["CloudWatch", "CloudTrail", "Inspector", "Trusted Advisor"],
      answer: "CloudWatch"
    },
    {
      question: "Which service registers domain names in AWS?",
      options: ["Route 53", "CloudFront", "API Gateway", "IAM"],
      answer: "Route 53"
    },
    {
      question: "Which AWS service is used for data warehousing?",
      options: ["Redshift", "S3", "Athena", "Glue"],
      answer: "Redshift"
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
    },
    // extra 5
    {
      question: "Which keyword defines the structure of data in GraphQL?",
      options: ["type", "schema", "interface", "model"],
      answer: "type"
    },
    {
      question: "What does GraphQL subscription provide?",
      options: [
        "Real-time data updates",
        "Data modification",
        "Schema validation",
        "Query optimization"
      ],
      answer: "Real-time data updates"
    },
    {
      question: "Which transport protocol is commonly used with GraphQL subscriptions?",
      options: ["WebSockets", "HTTP", "gRPC", "MQTT"],
      answer: "WebSockets"
    },
    {
      question: "What is introspection in GraphQL?",
      options: [
        "Querying the schema itself",
        "Debugging resolvers",
        "Monitoring queries",
        "Mutating schema dynamically"
      ],
      answer: "Querying the schema itself"
    },
    {
      question: "Which company originally developed GraphQL?",
      options: ["Facebook", "Google", "Netflix", "Amazon"],
      answer: "Facebook"
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
    },
    // extra 5
    {
      question: "What is overfitting in ML?",
      options: [
        "When a model learns noise instead of signal",
        "When a model underperforms",
        "When a model has too little data",
        "When training is incomplete"
      ],
      answer: "When a model learns noise instead of signal"
    },
    {
      question: "Which ML technique is used for grouping similar data points?",
      options: ["Clustering", "Regression", "Classification", "Reinforcement"],
      answer: "Clustering"
    },
    {
      question: "What is the purpose of a confusion matrix?",
      options: [
        "Evaluate classification performance",
        "Detect overfitting",
        "Reduce dimensionality",
        "Store dataset metadata"
      ],
      answer: "Evaluate classification performance"
    },
    {
      question: "Which deep learning framework was developed by Google?",
      options: ["TensorFlow", "PyTorch", "Keras", "Caffe"],
      answer: "TensorFlow"
    },
    {
      question: "Which optimization algorithm is widely used in training ML models?",
      options: ["Gradient Descent", "Monte Carlo", "Simulated Annealing", "Backtracking"],
      answer: "Gradient Descent"
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
    },
    // extra 5
    {
      question: "What is a private blockchain?",
      options: [
        "Blockchain accessible only to authorized participants",
        "Blockchain accessible by everyone",
        "Blockchain for cryptocurrencies only",
        "Blockchain used for cloud storage"
      ],
      answer: "Blockchain accessible only to authorized participants"
    },
    {
      question: "Which blockchain introduced smart contracts?",
      options: ["Ethereum", "Bitcoin", "Cardano", "Solana"],
      answer: "Ethereum"
    },
    {
      question: "What is a blockchain fork?",
      options: [
        "A change in blockchain protocol",
        "A new wallet type",
        "A mining technique",
        "A decentralized app"
      ],
      answer: "A change in blockchain protocol"
    },
    {
      question: "What is gas in Ethereum?",
      options: [
        "Fee paid to execute transactions",
        "A cryptocurrency",
        "Storage space",
        "Mining algorithm"
      ],
      answer: "Fee paid to execute transactions"
    },
    {
      question: "What is the main advantage of blockchain?",
      options: [
        "Decentralization and immutability",
        "Centralized control",
        "Free transactions",
        "Unlimited storage"
      ],
      answer: "Decentralization and immutability"
    }
  ]
}
};
