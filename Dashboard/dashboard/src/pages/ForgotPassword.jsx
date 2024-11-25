import {
  clearAllForgotPasswordErrors,
  forgotPasword,
} from "@/store/slices/forgetResetPasswordSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
const ForgotPassword = () => {
  const [ email, setEmail ] = useState("");
  const { loading, message, error } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleForgotPassword = async () => {
    dispatch(forgotPasword(email));
  };

  useEffect(()=>{
    if (error) {
      toast.error(error);
      dispatch(clearAllForgotPasswordErrors());
    }
    if (message !== null) {
      toast.success(message);
    }
    if (isAuthenticated) {
      navigate("/");
    }
  },[dispatch, error, isAuthenticated, loading])
  return (
    <>
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
              <div className="flex items-center">
              <Label htmlFor="email">Email</Label>
              <Link to={'/login'} className="ml-auto inline-block text-sm underline">
                Remember Password?
              </Link>
            </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {loading ? (
                <SpecialLoadingButton content={"Sending Mail"} />
              ) : (
                <Button type="submit" onClick={handleForgotPassword} className="w-full">
                  Send Mail
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ForgotPassword;
