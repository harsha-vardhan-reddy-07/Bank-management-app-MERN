import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, required: true },
    homeBranch: { type: String, required: true },
    ifsc: { type: String, required: true },
    password: { type: String, required: true },
    balance: {type: Number, default: 0}
});
const bankSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, required: true },
    password: { type: String, required: true }
});
const transactionSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    senderName: {type: String},
    receiverId: { type: String, required: true },
    receiverIFSC: { type: String },
    receiverName: {type: String},
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    time: { type: String, required: true }
});
const depositSchema = new mongoose.Schema({
    depositName: { type: String, required: true },
    customerId: { type: String, required: true },
    customerName: {type: String},
    nomineeName: {type: String},
    nomineeAge: {type: Number},
    duration: {type: Number},
    amount: { type: Number, required: true },
    createdDate: {type:String},
    matureDate: {type:String}
});
const loanSchema = new mongoose.Schema({
    loanType: { type: String },
    customerId: { type: String, required: true },
    customerName: {type: String},
    nomineeName: {type: String},
    nomineeAge: {type: String},
    duration: {type: Number},
    loanAmount: { type: Number },
    balance: { type: Number },
    loanStatus: {type: String, default: 'pending'},
    createdDate: {type: String},
    endDate: {type: String}
});

export const User = mongoose.model('users',userSchema);
export const Bank = mongoose.model('bank',bankSchema);
export const Transactions = mongoose.model('transactions',transactionSchema);
export const Deposits = mongoose.model('deposits',depositSchema);
export const Loans = mongoose.model('loans',loanSchema);