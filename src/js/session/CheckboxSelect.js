import React from "react";

export class CheckboxSelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedValues: [],
            dropdownVisible: false
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.prepareItem = this.prepareItem.bind(this);
    }

    render() {
        const {classes, options, placeholder } = this.props;
        const {dropdownVisible} = this.state;

        return (
            <div className={"d-flex flex-column justify-content-center checkbox-select " + classes}>
                <div className="d-flex justify-content-start align-items-center title-block" onClick={this.toggleDropdown}>
                    <div className="flex-grow-1">{placeholder}</div>
                    <img src={"/img/select-icon.png"} width="19" height="10" alt="" style={{marginRight: 20}}/>
                    <img src={"/img/sort-icon.png"} width="29" height="26" alt="" style={{marginRight: 20}}/>
                    <img src={"/img/filter-icon.png"} width="20" height="30" alt=""/>
                </div>
                {dropdownVisible ? (
                    <div className="select-block dashboard-scrollbar">
                        {
                            options.map((option, index) => (
                                this.prepareItem(option, index)
                            ))
                        }
                    </div>
                ) : null}


            </div>
        );
    }

    prepareItem(option, index) {
        return (
            <div className="row" key={index}>
                <div className="round">
                    <input type="checkbox" id={option.id} />
                    <label htmlFor={option.id} onClick={() => this.props.selectHandler(option.id)}></label>
                </div>
                <div className="round-label">
                    {option.name}
                </div>
            </div>

        );
    }

    toggleDropdown() {
        this.setState({dropdownVisible: !this.state.dropdownVisible});
    }

}

