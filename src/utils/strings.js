export function capitalizeFirstLetter(string) {
    let capitalized=new String(string)
    return capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
}

export function namesFromMail(string){
    let new_string=string.replace("@wgf.pl", "").split('.')
    new_string[0]=new_string[0].charAt(0).toUpperCase() + new_string[0].slice(1);
    new_string[1]=new_string[1].charAt(0).toUpperCase() + new_string[1].slice(1);

    return new_string[0]+' '+new_string[1]

}
