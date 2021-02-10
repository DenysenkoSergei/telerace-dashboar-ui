import * as React from "react";

const padTime = time => {
    return String(time).length === 1 ? `0${time}` : `${time}`;
};

const format = time => {
    const preparedTime = time % (60 * 60 * 24);
    const hours = Math.floor(preparedTime / 3600);
    const minutes = Math.floor((preparedTime % 3600) / 60);
    const seconds = preparedTime % 60;
    return `${padTime(hours)} : ${padTime(minutes)} : ${padTime(seconds)}`;
};

export default function SessionTimeCounter(props) {
    const {sessionStart} = props;

    const [counter, setCounter] = React.useState(Math.round((new Date().getTime() - new Date(sessionStart + ".000Z").getTime()) / 1000));

    React.useEffect(() => {
        let timer = setTimeout(
            () => setCounter(c =>
                                 Math.round((new Date().getTime() - new Date(sessionStart + ".000Z").getTime()) / 1000)),
            1000
        );

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [counter]);

    return (
        <div className="session-timer-wrapper">
            <div>{format(counter)}</div>
        </div>
    );
}