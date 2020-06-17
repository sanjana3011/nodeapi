const Razorpay = require('razorpay');
const shortid = require('shortid');
//const crypto = require('crypto')
const User = require('../models/user');
const dotenv = require("dotenv");
dotenv.config();



var instance = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET
});


 // exports.razor_validate = (req, res) => {
 // 	const secret = '12345678';

 // 	const shasum = crypto.createHmac('sha256', secret)
 // 	shasum.update(JSON.stringify(req.body))
 // 	const digest = shasum.digest('hex')

 // 	console.log(digest, req.headers['x-razorpay-signature'])

 // 	if (digest === req.headers['x-razorpay-signature']) {
 // 		console.log('request is legit')
 // 		// process it
 // 		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
 // 	} else {
 // 		// pass it
 // 	}
 // 	res.json({ status: "ok"});
 // };


exports.razor_success = (req, res) => {
    order_id = req.body.order_id;
        instance.orders.fetch(order_id).then((data) => {
            console.log("inside success");
            console.log(data);
            return res.json(data);
    }).catch((error) => {
      res.json(error);
    });
    //console.log(req);

//generated_signature = hmac_sha256(razorpay_order_id + "|" + razorpay_payment_id, secretkey);

 // if (generated_signature == razorpay_signature) {
 //   payment is successful
  //}
    };

exports.razor_CreateOrder = async (req, res) => {
	const payment_capture = 1;
	const amount = 5;
	const currency = 'INR';

    try {
	    const options = {
		    amount: (amount*100).toString(),
    		currency,
	    	receipt: shortid.generate(),  // Internal receipt id
		    payment_capture
	        };
        instance.orders.create(options, async function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: "Something Went Wrong",
                });
            }
        return res.status(200).json(order);
        });
    } 
    catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong",
        });
    }
};