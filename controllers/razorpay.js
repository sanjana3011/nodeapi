const Razorpay = require('razorpay');
const shortid = require('shortid');
const crypto = require('crypto')

var razorpay = new Razorpay({
	key_id: "rzp_test_LXKOg0N2YnCiFC",
	key_secret: "LSpZd3lnPcTWGVKBx83nh5C1"
});

exports.razor_validate = (req, res) => {
	const secret = '12345678';

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: "ok"});
};

exports.razor = async (req, res) => {
	const payment_capture = 1;
	const amount = 5;
	const currency = 'INR';

	const options = {
		amount: (amount*100).toString(),
		currency,
		receipt: shortid.generate(),
		payment_capture}

		try {
		    const response = await razorpay.orders.create(options);
    		console.log(response);
	    	res.json({
		    	id: response.id,
			    currency: response.currency,
    			amount: response.amount
		    });
    	} 
    	catch (error) {
	    	console.log(error)
	    }
};