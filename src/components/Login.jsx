import React from 'react';

const Login = () => {
  return (
    <section className="h-80 gradient-form" style={{ backgroundColor: '#eee' }}>
      <div className="container py-5 h-50">
        <div className="row d-flex justify-content-center align-items-center h-60">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body mx-md-4">
                    <div className="text-center">
                      <img
                        src="/images/logo.png"
                        style={{ width: '255px' }}
                        alt="logo"
                      />
                    </div>

                    <form>
                      <p style={{fontFamily: "'Montserrat', sans-serif", marginTop:'-30px', textAlign:'center' }}>Please login to your account</p>

                      <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form2Example11" style={{fontFamily: "'Montserrat', sans-serif" }}>
                          Username
                        </label>
                        <input
                          type="email"
                          id="form2Example11"
                          className="form-control"
                          style={{fontFamily: "'Montserrat', sans-serif" }}
                          placeholder="Phone number or email address"
                        />
                      </div>

                      <div className="form-outline mb-4">
                      <label style={{fontFamily: "'Montserrat', sans-serif" }} className="form-label" htmlFor="form2Example22">
                          Password
                        </label>
                        <input
                          type="password"
                          id="form2Example22"
                          className="form-control"
                        />
                        
                      </div>

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button
                          className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                          type="button"
                          style={{fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Log in
                        </button>
                        <a className="text-muted" href="#!" style={{fontFamily: "'Montserrat', sans-serif" }}>
                          Forgot password?
                        </a>
                      </div>

                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">Don't have an account?</p>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          style={{fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Create new
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4">We are more than just a company</h4>
                    <p className="small mb-0">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
