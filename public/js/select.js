const generateASelect = (props) => {
    const {name, elements, selected, className} = props
    const select = document.createElement('select');
    select.name = (name) ? name : '';
    select.className = (className) ? className : '';
    elements.forEach(element => {
        const option = document.createElement('option');
        option.text = element;
        option.value = element;
        if(element === selected)
            option.selected = true;
        select.appendChild(option);
    })
    return select;
}

export {
    generateASelect
}