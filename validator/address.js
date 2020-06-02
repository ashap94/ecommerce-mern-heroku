require("dotenv").config();
const EasyPost = require("@easypost/api");
const api = new EasyPost(process.env.EASYPOST_TEST_API_KEY);

exports.verifyAddress = (req, res, next) => {
  const deliveryAddress = Object.assign({}, req.body);
  //   deliveryAddress["name"] = req.profile.name;
  deliveryAddress["country"] = "US";

  const verifyAddress = new api.Address(
    Object.assign({}, deliveryAddress, { ["verify"]: ["delivery"] })
  );

  verifyAddress.save().then((addr) => {
    if (!addr.verifications.delivery.success) {
      return res.status(400).json({
        errors: addr.verifications.delivery.errors,
      });
    }

    // const verifiedAddress = addr;
    // delete verifiedAddress["id"];
    // delete verifiedAddress["object"];
    // delete verifiedAddress["mode"];
    // delete verifiedAddress["verify"];
    // delete verifiedAddress["verifications"];

    const verifiedAddress = {
      name: addr.name,
      street1: addr.street1,
      street2: addr.street2,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
      company: addr.company,
    };

    req.verifiedAddress = verifiedAddress;
    console.log("ADDRESS IN REQUEST:  ", req.verifiedAddress);

    res.json(verifiedAddress);

    /*
        utilize str appendation when necessary for parsing address data and storing in database

        str = name + "\n" + company + "\n" + add + " " + add2 + "\n" + city + " " + state + " " + zip
    */

    // next();
  });
};
