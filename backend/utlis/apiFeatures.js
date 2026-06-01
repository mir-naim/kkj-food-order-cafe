//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: API Features
//Descrption: Implement search, filter and pagination
//First written on: 29 July 2023
//Edited on:


class APIFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        this.query = this.query.find({...keyword});
        return this;
    }


    filter(){
        const queryCopy ={...this.queryStr};

        //Removing fields from query

        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(el => delete queryCopy[el]);
  
        //Advance filter for price , ratings
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|gte|lt|lte)\b/g, match =>`$${match}`)

    
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);


        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }

}

module.exports = APIFeatures