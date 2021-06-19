
class UserDataQueries {
    static queryData(currentPage:number | null, hasNextPage:boolean, hasPrevPage:boolean, forward:boolean) {
        let pageNum; 

        if (hasNextPage && currentPage && !forward) {
            pageNum = currentPage - 1
        }; 
        
        if (hasPrevPage && currentPage && forward) {
            pageNum = currentPage + 1
        }; 

        const endpoint = `/api/data/userData?pageNum=${pageNum ? pageNum : ""}`;

        const response = fetch(endpoint);
        
        return response; 
    }
}

export default UserDataQueries;
