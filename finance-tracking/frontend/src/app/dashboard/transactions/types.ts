export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";


export interface Transaction{
    id:number,
    accountId:number,
    accountName:string,
    amount:number,
    currency:string,
    type:TransactionType,
    date:Date,
    categoryName? : string,
    merchant? :string,
    notes? :number,
    receiptUrl? :string
}