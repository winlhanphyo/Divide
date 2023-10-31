import axios from "axios";

const getUser = () => {
  const user = JSON.parse(localStorage.getItem("admin"));
  
  const res = { 
    token: null,
    id: null
  };

  if (user) {
    res.token = (user?.accessToken) && "Bearer " + user.accessToken;
    res.id = (user?.id) && user.id;
  }
  return res;
}
const instance = axios.create({
  baseURL: "http://davide-api.orionmmtecheng.com/api"
});

const user = getUser();
instance.defaults.headers.common['Authorization'] = user?.token;
instance.defaults.headers.common['userId'] = user?.id;

export default instance;
