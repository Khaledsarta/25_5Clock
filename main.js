!function() {
    "use strict";

    class LengthControl extends React.Component {
        render() {
            const { titleID, title, minID, addID, lengthID, length, onClick } = this.props;
            return React.createElement("div", { className: "length-control" },
                React.createElement("div", { id: titleID }, title),
                React.createElement("button", { className: "btn-level", id: minID, onClick, value: "-" }, React.createElement("i", { className: "fa fa-arrow-down fa-2x" })),
                React.createElement("div", { className: "btn-level", id: lengthID }, length),
                React.createElement("button", { className: "btn-level", id: addID, onClick, value: "+" }, React.createElement("i", { className: "fa fa-arrow-up fa-2x" }))
            );
        }
    }

    class Clock extends React.Component {
        state = {
            brkLength: 5,
            seshLength: 25,
            timerState: "stopped",
            timerType: "Session",
            timer: 1500,
            intervalID: null,
            alarmColor: { color: "white" }
        };

        setLength = (type, delta) => {
            const lengthKey = type === "Break" ? "brkLength" : "seshLength";
            const currentLength = this.state[lengthKey];

            if (this.state.timerState === "running" || currentLength <= 1 && delta === -1 || currentLength >= 60 && delta === 1) return;

            this.setState({
                [lengthKey]: currentLength + delta,
                timer: this.state.timerType === type ? (currentLength + delta) * 60 : this.state.timer
            });
        };

        timerControl = () => {
            this.state.timerState === "stopped" ? this.startTimer() : this.stopTimer();
        };

        startTimer = () => {
            const intervalID = setInterval(this.countDown, 1000);
            this.setState({ timerState: "running", intervalID });
        };

        stopTimer = () => {
            clearInterval(this.state.intervalID);
            this.setState({ timerState: "stopped", intervalID: null });
        };

        countDown = () => {
            this.setState(prevState => ({ timer: prevState.timer - 1 }), this.checkPhase);
        };

        checkPhase = () => {
            const { timer, timerType, brkLength, seshLength } = this.state;
            if (timer < 0) {
                this.audioBeep.play();
                this.setState({
                    timer: (timerType === "Session" ? brkLength : seshLength) * 60,
                    timerType: timerType === "Session" ? "Break" : "Session",
                    alarmColor: { color: "white" }
                });
            } else {
                this.setState({
                    alarmColor: timer < 61 ? { color: "#a50d0d" } : { color: "white" }
                });
            }
        };

        reset = () => {
            clearInterval(this.state.intervalID);
            this.audioBeep.pause();
            this.audioBeep.currentTime = 0;
            this.setState({
                brkLength: 5,
                seshLength: 25,
                timerState: "stopped",
                timerType: "Session",
                timer: 1500,
                intervalID: null,
                alarmColor: { color: "white" }
            });
        };

        formatTime = () => {
            const minutes = Math.floor(this.state.timer / 60).toString().padStart(2, "0");
            const seconds = (this.state.timer % 60).toString().padStart(2, "0");
            return `${minutes}:${seconds}`;
        };

        render() {
            const { brkLength, seshLength, timerType, alarmColor } = this.state;
            return React.createElement("div", null,
                React.createElement("div", { className: "main-title" }, "25 + 5 Clock"),
                React.createElement(LengthControl, {
                    title: "Break Length",
                    titleID: "break-label",
                    minID: "break-decrement",
                    addID: "break-increment",
                    lengthID: "break-length",
                    length: brkLength,
                    onClick: e => this.setLength("Break", e.target.value === "+" ? 1 : -1)
                }),
                React.createElement(LengthControl, {
                    title: "Session Length",
                    titleID: "session-label",
                    minID: "session-decrement",
                    addID: "session-increment",
                    lengthID: "session-length",
                    length: seshLength,
                    onClick: e => this.setLength("Session", e.target.value === "+" ? 1 : -1)
                }),
                React.createElement("div", { className: "timer", style: alarmColor },
                    React.createElement("div", { className: "timer-wrapper" },
                        React.createElement("div", { id: "timer-label" }, timerType),
                        React.createElement("div", { id: "time-left" }, this.formatTime())
                    )
                ),
                React.createElement("div", { className: "timer-control" },
                    React.createElement("button", { id: "start_stop", onClick: this.timerControl },
                        React.createElement("i", { className: "fa fa-play fa-2x" }),
                        React.createElement("i", { className: "fa fa-pause fa-2x" })
                    ),
                    React.createElement("button", { id: "reset", onClick: this.reset },
                        React.createElement("i", { className: "fa fa-refresh fa-2x" })
                    )
                ),
                React.createElement("div", { className: "author" },
                    "Designed and Coded by ", React.createElement("br", null),
                    React.createElement("a", { href: "https://www.linkedin.com/in/khaled-sarta/", target: "_blank", rel: "noreferrer" }, "Khaled Elsarta")
                ),
                React.createElement("audio", {
                    id: "beep",
                    preload: "auto",
                    ref: e => { this.audioBeep = e; },
                    src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
                })
            );
        }
    }

    ReactDOM.createRoot(document.getElementById("app")).render(React.createElement(Clock));
}();
