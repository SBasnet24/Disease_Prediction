import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import { Send } from "../../helper";
import Loader from "react-loader-spinner";
import { Accordion, Card } from "react-bootstrap";
import { ProgressBar } from "react-bootstrap";
import Swal from "sweetalert2";



const Landing = () => {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const history = useHistory();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [message, setMessage] = useState("");
  const [error,setError] = useState("");
  // If logged in redirect to dashboard
  useEffect(() => {
    if (isAuth) history.push("/dashboard");
  }, [isAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let res = await Send(symptoms);
    console.log(res,"res");
    if(res.msg){
      setLoading(false);
      setError(res.msg);
      setDiseases([]);
      Swal.fire("Error", res.msg, "error")
          .then(async (result)=>{
            if(result.value){
              window.location ="/";
            }
          });
    }else if(res.returnData){
      if(res.returnData.length >0){
        setDiseases(res.returnData);
        setLoading(false);
      }
    }
  };

  console.log(diseases);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center align-items-center m-l70">
          <div className="col-8 p-0">
            <div className="inner__section mt-4">
              <div className="input-group main__input mb-3">
                <TextareaAutosize
                  type="text"
                  className="form-control input__type__inner"
                  placeholder="HOW DO YOU FEEL?"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  minRows={1}
                  maxRows={6}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-1">
            <button
              className="btn btn-secondary btn__main text-uppercase"
              disabled={!symptoms}
            >
              Predict
            </button>
          </div>
        </div>
            {symptoms.length>0 && loading=== false && diseases.length === 0 && error.length === 0 && <p>"Provide more symptoms to get correct database"</p>}
      </form>
      {loading === true && (
        <div style={{ textAlign: "center" }}>
          <br></br>
          <br></br>
          <Loader
            type="ThreeDots"
            color="#6c757d"
            height={100}
            width={1000}
            visible={loading}
          />
          <span>{message}</span>
        </div>
      )}
      {diseases.length > 0 && loading === false && (
        <div>
          {diseases.map((disease) => {
            let now = disease.probability;
            return (
              <div className="row justify-content-center">
                <div className="col-8">
                  <Accordion key={disease._id}>
                    <Card>
                      <Accordion.Toggle
                        as={Card.Header}
                        eventKey="0"
                        className="card__header"
                      >
                        <p className="according__class__p">{`${disease.name} ${now}%`}</p>
                        <ProgressBar
                          now={disease.probability}
                          variant="success"
                        />
                      </Accordion.Toggle>

                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {disease.description}

                      Accurate Symptoms of {disease.name}:
                      {disease.symptoms.map((s)=>{
                        return <ul>
                          <li>{s}</li>
                        </ul>
                      })}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Landing;
