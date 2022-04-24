function selectDoc(name) {
    // console.log(name);
    let status = document.getElementsByName(name)[0].checked;
    if (name == 'allMyDoc') {
        let all = document.getElementsByName('myDoc');
        for (let i = 0; i < all.length; ++i) {
            if (status == true) {
                all[i].checked = 'checked';
            } else {
                all[i].checked = null;
            }
        }
    } else if (name == 'allRecDoc') {
        let all = document.getElementsByName('recDoc');
        for (let i = 0; i < all.length; ++i) {
            if (status == true) {
                all[i].checked = 'checked';
            } else {
                all[i].checked = null;
            }
        }
    }
}