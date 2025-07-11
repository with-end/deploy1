export function formateDate(date){

    const formatedDate = new Date(date).toLocaleDateString() ;

    return formatedDate;
}