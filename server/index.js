import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Bank, Deposits, Loans, Transactions, User } from './schemas.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

// mongoose setup

const PORT = 6001;
mongoose.connect('mongodb://localhost:27017/bankManagement', { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(()=>{

    // All the client-server activites


    app.post('/register', async (req, res) => {
        const { username, email, usertype, password, homeBranch } = req.body;
        try {
          if (usertype === 'customer'){
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const IFSC = {'hyderabad': 'SB007HYD25', 
                            'bangalore': 'SB007BLR30',
                            'chennai': 'SB007CNI99', 
                            'mumbai': 'SB007MBI12', 
                            'tirupati': 'SB007TPTY05',
                            'vizag': 'SB007VZG229',
                            'pune': 'SB007PN77', 
                            'delhi': 'SB007DLI09', 
                            'kochi': 'SB007KCI540',
                            'Venkatagiri': 'SB007VGR313',  }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                usertype,
                homeBranch,
                ifsc : IFSC[homeBranch],
                password: hashedPassword
            });
            const userCreated = await newUser.save();
            return res.status(201).json(userCreated);
          }else if (usertype === 'admin'){
            const existingUser = await Bank.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new Bank({ username, email, usertype, password: hashedPassword });
            const userCreated = await newUser.save();            
            return res.status(201).json(userCreated);
          }
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });


    app.post('/login', async (req, res) => {
        const { email, usertype, password } = req.body;
        try {

          if (usertype === 'customer'){

                const user = await User.findOne({ email });
        
                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                } else{
                    
                    return res.json(user);
                }
          }else if (usertype === 'admin'){
                const user = await Bank.findOne({ email });
                
                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                } else{   
                    return res.json(user);
                }
          }
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });
      


    app.get('/user-details/:id', async (req, res) => {
        try{

            const user = await User.findOne({_id: req.params.id});
            if(!user){
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });


    // Send money

    app.post('/send-money', async (req, res) =>{

        const {senderId, senderName, remarks, receiverId, receiverIFSC, amount, paymentMethod, time} = req.body;
        console.log(req.body);
        try{
            const sender = await User.findOne({_id: senderId});
            const receiver = await User.findOne({_id: receiverId});
            if(!receiver){
                return res.status(404).json({message: 'Receiver not exists'})
            }
            if(receiver.ifsc !== receiverIFSC){
                return res.status(500).json({message: 'Transaction failed'})
            }
            const receiverName = receiver.username;

            const transaction = new Transactions({
                senderId,
                senderName,
                receiverId,
                receiverIFSC,
                receiverName,
                amount,
                remarks,
                paymentMethod,
                time
            })

            const newTransaction = await transaction.save();

            sender.balance = parseFloat(sender.balance) - parseFloat(amount);
            receiver.balance = parseFloat(receiver.balance) + parseFloat(amount);

            await sender.save();
            await receiver.save();

            res.json({message: 'Transaction successful'});

        } catch (err){

        }
    });



    // fetch all transactions

    app.get('/transactions', async (req, res)=>{
        try{

            const transactions = await Transactions.find();
            res.json(transactions);

        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })

    // All deposits

    app.get('/fetch-deposits', async (req, res)=>{
        try{
            const deposits = await Deposits.find();
            res.json(deposits);
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })

    // new deposit

    app.post('/new-deposit', async (req, res) =>{
        const {depositName, depositType, customerId, customerName, nomineeName, nomineeAge, duration, amount, createdDate} = req.body
        try{
            const date = new Date(createdDate);
            let matureDate = '';
            matureDate =  matureDate.concat(parseInt(date.getDate()), '-', (parseInt(date.getMonth())+1 + parseInt(duration))%12 , '-', ((parseInt(date.getFullYear()) + Math.floor((parseInt(date.getMonth()) + 1 + parseInt(duration))/12))));
            const user = await User.findOne({_id: customerId});
            const newDeposit = new Deposits({
                depositName, depositType, customerId, customerName, nomineeName, nomineeAge, duration, amount, createdDate, matureDate
            });

            const transaction = new Transactions({
                senderId: customerId, senderName: customerName, deposit: depositName, amount, time: new Date(), remarks: "Deposit payment"
            })
            await transaction.save();

            const depo = await newDeposit.save();
            user.balance = user.balance - amount;
            await user.save();
            res.json({message: "deposit created"});
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })

    
    // All loans

    app.get('/fetch-loans', async (req, res)=>{
        try{
            const loans = await Loans.find();
            res.json(loans);
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })

    // New loan

    app.post('/new-loan', async (req, res) => {
        try {
          const { loanType, customerId, customerName, nomineeName, nomineeAge, duration, loanAmount, createdDate } = req.body;
          const date = new Date();
          let endDate = '' 
          endDate = endDate.concat(parseInt(date.getDate()), '-', (parseInt(date.getMonth())+1 + parseInt(duration))%12 , '-', ((parseInt(date.getFullYear()) + Math.floor((parseInt(date.getMonth()) + 1 + parseInt(duration))/12))));
          
          
          const balance = loanAmount;
          const newLoan = new Loans({
            loanType,
            customerId,
            customerName,
            nomineeName,
            nomineeAge,
            duration,
            loanAmount,
            balance,
            createdDate,
            endDate,
          });
          console.log(endDate);
          console.log(newLoan);
          const loan = await newLoan.save();
          return res.json({ message: "loan request created" }); // Send the response here
        } catch (err) {
          return res.status(500).json({ message: "Error occurred" }); // Handle the error and send the response here
        }
      });
      

 
    // fetch all users

    app.get('/fetch-users', async (req, res)=>{

        try{
            const users = await User.find();
            res.json(users);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    // Approve loan

    app.put('/approve-loan', async (req, res)=>{
        const {id} = req.body;
        try{
            console.log(id)
            const loan = await Loans.findOne({_id: id});
            const user = await User.findOne({_id: loan.customerId});
            loan.loanStatus = 'approved';
            user.balance = user.balance + loan.loanAmount;
            
            const transaction = new Transactions({
                receiverId: user._id, loan: loan.loanType, amount: loan.loanAmount, time: new Date(), remarks: "Loan approved!!"
            })

            await loan.save();
            await user.save();
            await transaction.save();

            res.json({message:"loan approved successfully"});

        }catch(err){
            res.status(500).json({message: err});
        }
    })

    // Decline loan

    app.put('/decline-loan', async (req, res)=>{
        try{
            const {id} = req.body;
            const loan = await Loans.findOne({_id: id});
            loan.loanStatus = 'declined';
            await loan.save();
            res.json({message:"loan declined successfully"});

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })

    //  Repay loan

    app.post('/repay-loan', async (req, res)=>{
        const {id, amount} = req.body;
        try{
            const loan = await Loans.findOne({_id: id});
            const user = await User.findOne({_id: loan.customerId});
            loan.balance = loan.balance - amount;
            user.balance = user.balance - amount;
            await loan.save();
            await user.save();

            const transaction = new Transactions({
                senderId: user._id, loan: loan.loanType, amount, time: new Date(), remarks: "Loan re-payment"
            })
            await transaction.save();

            res.json({message: 'repayment successful'});
        }catch(err){
            res.status(500).json({message: 'message occured'});
        }
    })




        app.listen(PORT, ()=>{
            console.log(`Running @ ${PORT}`);
        });
    }
).catch((e)=> console.log(`Error in db connection ${e}`));