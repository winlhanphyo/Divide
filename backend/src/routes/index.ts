import { Router } from "./custom-router";
import { orderRouter  } from "./v1/order";
import { userRouter } from "./v1/user";
import { productRouter } from "./v1/product";
import { categoryRouter } from "./v1/category";
import { mediaRouter } from "./v1/media";
import { contactRouter } from "./v1/contact";
import { dashboardRouter } from "./v1/dashboard/dashboard.router";

const v1ApiRoutes = new Router();

const baseRouter = new Router();

try {
  
  v1ApiRoutes.use('/media', mediaRouter);
  v1ApiRoutes.use('/product', productRouter);
  v1ApiRoutes.use('/user', userRouter);
  v1ApiRoutes.use('/order', orderRouter);
  v1ApiRoutes.use('/category', categoryRouter);
  v1ApiRoutes.use('/contact', contactRouter);
  v1ApiRoutes.use('/dashboard', dashboardRouter);

  baseRouter.use('/api/v1', v1ApiRoutes);

} catch (err) {
  throw err;
}

export const router = baseRouter.toExpressRequestHandler();
