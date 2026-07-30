import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddDeliveryAddressForm from "./AddAddress";
import { useLocation, useNavigate } from "react-router-dom";
import OrderSummary from "./OrderSummary";

const steps = [
  "Login",
  "Delivery Adress",
  "Order Summary",
  "Payment",
];

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(1);
  const [skipped, setSkipped] = React.useState(new Set());
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const step = queryParams.get('step');
  const navigate=useNavigate();
 
console.log("step",step)


  const handleNext = () => {
    let newSkipped = skipped;
   

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    const currentStep = Number(step);
    if (currentStep <= 2) {
      // From Delivery Address, go back to cart
      navigate("/cart");
    } else {
      navigate(`/checkout?step=${currentStep - 1}`);
    }
  };



  const handleReset = () => {
    setActiveStep(0);
  };

  const handlePayment=()=>{
    console.log("handle payment")
  }

  return (
    <Box className="px-2 sm:px-5 lg:px-32" sx={{ width: "100%" }}>
      <Stepper activeStep={Number(step)} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
         
          return (
            <Step key={label} {...stepProps}>
              <StepLabel 
                {...labelProps}
                sx={{ 
                  '& .MuiStepLabel-label': { 
                    fontSize: { xs: '0.65rem', sm: '0.85rem', md: '1rem' } 
                  } 
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={false}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            
          </Box>
          {/* <Typography sx={{ my: 6 }}>Title</Typography> */}

          <div className="my-5">
            {Number(step) === 2 ? (
              <AddDeliveryAddressForm handleNext={handleNext} />
            ) : Number(step) === 3 ? (
              <OrderSummary />
            ) : null}
          </div>

          {/* <AddDeliveryAddressForm handleNext={handleNext} /> */}

          
        </React.Fragment>
      )}
    </Box>
  );
}
