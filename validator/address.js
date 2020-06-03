require("dotenv").config();
const EasyPost = require("@easypost/api");
const api = new EasyPost(process.env.EASYPOST_TEST_API_KEY);

exports.verifyAddress = (req, res, next) => {
  const deliveryAddress = Object.assign({}, req.body.address);
  console.log("BACKEND ADDRESS OBJECT:  ", deliveryAddress);
  //   deliveryAddress["name"] = req.profile.name;

  if (!("name" in deliveryAddress)) {
    return res.status(400).json({
      errors: [
        {
          message: "Name is required for shipping",
        },
      ],
    });
  }

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

    console.log("WHAT IS addr:  ", addr);

    if (addr.zip.split("-")[0] !== deliveryAddress.zip) {
      return res.status(400).json({
        errors: [
          {
            message: `Zip Code does not match Address`,
          },
          {
            message: `Did you mean: ${addr.zip.split("-")[0]}?`,
          },
        ],
      });
    }

    if (addr.city.toUpperCase() !== deliveryAddress.city.toUpperCase()) {
      return res.status(400).json({
        errors: [
          {
            message: `City does not match Address`,
          },
          {
            message: `Did you mean: ${addr.city}?`,
          },
        ],
      });
    }

    if (addr.state !== deliveryAddress.state.split(" - ")[0]) {
      return res.status(400).json({
        errors: [
          {
            message: `State does not match Address`,
          },
          {
            message: `Did you mean: ${addr.state}?`,
          },
        ],
      });
    }

    // if (addr.city.toUpperCase() !== deliveryAddress.city.toUpperCase()) {
    //   return res.status(400).json({
    //     errors: [
    //       {
    //         message: `City does not match Address`,
    //       },
    //       {
    //         message: `Did you mean: ${addr.city}?`,
    //       },
    //     ],
    //   });
    // }

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
