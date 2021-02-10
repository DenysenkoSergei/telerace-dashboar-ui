import React from "react";

function NewlineText(props) {
    let i = 0;
    return props.text.split('\n')
        .map(str => <p key={i++} className='newline-text-paragraph'>{str}</p>);
}

export default NewlineText;