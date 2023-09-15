import StegCloak from "stegcloak";

const encode = (data: string, salt: string) =>{
    let encoder = new StegCloak(false, false);
    let finalStr = encoder.hide(data, "", salt);
    return finalStr;
}