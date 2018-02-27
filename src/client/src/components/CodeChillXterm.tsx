import * as React from "react";
import { Terminal } from "xterm";
import * as ClassName from "classnames";
import * as TextEncoding from "text-encoding";

export interface IxTermProps extends React.DOMAttributes<{}> {
    onChange?: (e: any) => void;
    onInput?: (e: any) => void;
    onFocusChange?: Function;
    addons?: string[];
    onScroll?: (e: any) => void;
    onContextMenu?: (e: any) => void;
    options?: any;
    path?: string;
    value?: string;
    className?: string;
    style?: React.CSSProperties;
    url: string;
}

export interface IxTermState {
    isFocused: boolean;
}

export default class CodeChillXterm extends React.Component<IxTermProps, IxTermState> {
    xterm: Terminal;
    refs: {
        [s: string]: any;
        container: HTMLDivElement;
    };
    webSocket: WebSocket;
    msg: string;

    constructor(props: IxTermProps, context?: any) {
        super(props, context);
        this.state = {
            isFocused: false
        };
        // this.props.options
        this.msg = "";

        this.xterm = new Terminal({
            cursorBlink: false,  // Do not blink the terminal's cursor
            cols: 120,  // Set the terminal's width to 120 columns
            rows: 80  // Set the terminal's height to 80 rows
        });
    }

    componentDidMount() {
        const xt = this;

        if (xt.props.url) {
            xt.webSocket = new WebSocket(xt.props.url);
            // this.webSocket.addEventListener("message", this.recieveData);
        }

        xt.webSocket.onopen = function(event: Event) {
            console.log("connexion");
        };
        xt.webSocket.onerror = function() {
            console.log("onerreur");
        };
        xt.webSocket.onmessage = function(event: any) {
            console.log("onmessage");
            let decoder = new TextEncoding.TextDecoder("utf-8");
            var fileReader = new FileReader();
            fileReader.onload = function() {
                xt.write(decoder.decode(this.result));
            };
            fileReader.readAsArrayBuffer(event.data);
        }; 
        // Terminal.applyAddon(attach);
        // this.xterm = new Terminal(this.props.options);
        
        this.xterm.open(this.refs.container);
        this.xterm.on("focus", this.focusChanged.bind(this, true));
        this.xterm.on("blur", this.focusChanged.bind(this, false));
        this.xterm.on("resize", function(size: any) {
            xt.xterm.resize(size.cols, size.rows);
        });

        if (this.props.onContextMenu) {
            this.xterm.element.addEventListener("contextmenu", this.onContextMenu.bind(this));
        }

        if (this.props.onInput) {
            this.xterm.on("data", this.onInput);
        }

        if (this.props.value) {
            this.xterm.write(this.props.value);
        }

        this.getTerminal().on("key", function(key: string, e: KeyboardEvent) {
            // e: KeyboardEvent; e.key: string; e.which: numberx
            xt.msg = xt.msg + key;
            if (e.key === "Backspace") {
                xt.xterm.write("\b");
            }
            if (e.key === "Enter") {
                xt.webSocket.send(xt.msg);     
                xt.msg = "";
                xt.xterm.write("\r\n");
            } else {
                xt.xterm.write(key);
            }
        });
        
    }

    componentWillUnmount() {
        if (this.xterm) {
            this.xterm.destroy();
            delete this.xterm;
        }
    }

    getTerminal() {
        return this.xterm;
    }

    write(data: any) {
        this.xterm.write(data);
    }

    writeln(data: any) {
        this.xterm.writeln(data);
    }

    focus() {
        if (this.xterm) {
            this.xterm.focus();
        }
    }

    focusChanged(focused: boolean) {
        this.setState({
            isFocused: focused
        });
        if (this.props.onFocusChange) {
            this.props.onFocusChange(focused);
        }
    }

    onInput = (data: any) => {
        if (this.props.onInput) {
            this.props.onInput(data);
        }
    }

    resize (cols: number, rows: number) {
        this.xterm.resize(Math.round(cols), Math.round(rows));
    }

    setOption(key: string, value: boolean) {
        this.xterm.setOption(key, value);
    }

    refresh() {
        this.xterm.refresh(0, this.xterm.rows - 1);
    }

    onContextMenu(e: any) {
        if (this.props.onContextMenu) {
            this.props.onContextMenu(e);
        }
    }

    render() {
        const terminalClassName = ClassName(
            "CodeChillXterm",
            this.state.isFocused ? "CodeChillXterm--focused" : null,
            this.props.className
        );
        const container = "container";
        return (
            <div ref={container} className={terminalClassName} />
        );
    }
}

export { Terminal, CodeChillXterm };