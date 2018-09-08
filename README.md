# HttpToCli
Daemon for forwarding REST HTTP traffic to system CLI.
Easy to config: Just edit `config.json`.
There is no option to specify http method. Each is taken into account.
Support for static files in indicated paths.

## Run
`npm run run`

## Args
--port {ServerPortNumber}

## Config
`config.json`

Example:
```
{
    "serverPort": 3000,
    "routes": [
        { "url": "/ping", "action": "echo pong" },
        { "url": "/test/:test", "action": "echo test ok {test}" },
        { "url": "/shell/:cmd", "action": "{cmd}" }
    ],
    "statics": [
        { "url": "/files", "dir": "./shared_files" }
    ]
}
```
