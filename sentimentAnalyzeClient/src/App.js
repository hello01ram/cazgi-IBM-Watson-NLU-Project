import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';

class App extends React.Component {
    /*
    We are setting the component as a state named innercomp.
    When this state is accessed, the HTML that is set as the 
    value of the state, will be returned. The initial input mode
    is set to text
    */
    state = {
        innercomp: <textarea rows="4" cols="50" id="textinput" />,
        mode: "text",
        sentimentOutput: [],
        sentiment: true, 
        errorOutput: ''
    }

    /*
    This method returns the component based on what the input mode is.
    If the requested input mode is "text" it returns a textbox with 4 rows.
    If the requested input mode is "url" it returns a textbox with 1 row.
    */

    renderOutput = (input_mode) => {
        let rows = 1
        let mode = "url"
        //If the input mode is text make it 4 lines
        if (input_mode === "text") {
            mode = "text"
            rows = 4
        }
        this.setState({
            innercomp: <textarea rows={rows} cols="50" id="textinput" />,
            mode: mode,
            sentimentOutput: [],
            sentiment: true
        });
    }

    sendForSentimentAnalysis = async () => {
        this.setErrorState();
        this.setState({ sentiment: true });
        const mode = this.state.mode;
        const inputValue = document.getElementById("textinput").value;
        const url = `./${mode}/sentiment?${mode}=${inputValue}`;

        try {
            const response = await fetch(url);
            if (response.status === 500) {
                const data = await response.text();
                this.setErrorState(data);
                return; 
            } else {
                const {label} = await response.json();
                this.setState({ sentimentOutput: label });
                let color = "white"
                switch (label) {
                    case "positive": color = "green"; break;
                    case "negative": color = "red"; break;
                    default: color = "yellow"; break;
                }
                const output = <div style={{ color: color, fontSize: 20 }}>{label}</div>
                this.setState({ sentimentOutput: output });
            }
        } catch (err) {
            this.setErrorState('Something went wrong :(');
        }
    }

    sendForEmotionAnalysis = async () => {
        this.setErrorState();
        this.setState({ sentiment: false });
        const inputValue = document.getElementById("textinput").value;
        const mode = this.state.mode;
        const url = `./${mode}/emotion?${mode}=${inputValue}`;
        try {
            const response = await fetch(url)
            if (response.status === 500) {
                const data = await response.text();
                this.setErrorState(data);
                return; 
            } else {
                const data = await response.json();
                this.setState({ sentimentOutput: <EmotionTable emotions={data} /> });
            }
        } catch (err) {
            this.setErrorState('Something went wrong :(');
        }
    }

    setErrorState(errorMessage) {
        const style = {
            color: 'red', 
            fontSize: '24px'
        };
        const output = errorMessage ? <div style={style}>{errorMessage}</div> : '';
        this.setState({errorOutput: output});
    }


    render() {
        return (
            <div className="App">
                <button className="btn btn-info" onClick={() => { this.renderOutput('text') }}>Text</button>
                <button className="btn btn-dark" onClick={() => { this.renderOutput('url') }}>URL</button>
                <br /><br />
                {this.state.innercomp}
                <br />
                <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
                <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
                <br />
                {this.state.sentimentOutput}
                {this.state.errorOutput}
            </div>
        );
    }
}

export default App;
