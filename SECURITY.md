# Security Policy

V7 Scanner takes the security of your codebase seriously. As a security scanner itself, the tool is designed securely from the ground up.

## Core Guarantees

1.  **Zero Dependencies**: We have exactly zero dependencies. This completely eliminates supply chain attacks commonly found in large npm packages. Every line of code is auditable in seconds.
2.  **No Code Execution**: We never use `eval()`, `new Function()`, or `child_process`. We read your files simply as text streams.
3.  **No Network Access**: The tool does not make any HTTP requests. It never "phones home" and never tracks your usage.
4.  **Local Only**: The entire analysis happens on your local file system or CI runner.

## Reporting a Vulnerability

If you find a security issue *within* the V7 Scanner engine itself, please do not open a public issue.

Email the author directly or contact them via https://www.vaibhawkumarparashar.in.
All reports will be handled promptly.
