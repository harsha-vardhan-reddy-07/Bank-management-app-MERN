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
    senderId: { type: String },
    senderName: {type: String},
    remarks: {type: String},
    receiverId: { type: String},
    receiverIFSC: { type: String },
    receiverName: {type: String},
    deposit: {type: String},
    loan: {type: String},
    loanApproved: {type: Boolean, default: false},
    amount: { type: Number, required: true },
    paymentMethod: { type: String },
    time: { type: String}
});
const depositSchema = new mongoose.Schema({
    depositName: { type: String, required: true },
    depositType: {type: String},
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