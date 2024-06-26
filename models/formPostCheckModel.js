import mongoose from "mongoose";

const formShema = new mongoose.Schema({
  postId: { type: String },
  date: { type: String },
  expired: { type: String },
  userId: { type: String },
  hidden: { type: Boolean },
  currentPage: { type: Number },
  prioritize: { type: String, default: null },
  view: { type: Number, default: 0 },
  userInfo: {
    avatar: { type: String },
    fullName: { type: String },
    districtValueName: { type: String },
    cityValueName: { type: String },
    wardValueName: { type: String },
    phone: { type: String },
    selling: { type: String },
    selled: { type: String },
  },
  post: {
    image: [{ uuid: { type: String }, img: { type: String } }],
    value: { type: String },
    title: { type: String },
    dateCar: { type: String },
    person: { type: String },
    form: { type: String },
    price: { type: Number },
    km: { type: Number },
    fullAddress: { type: String },
    introducing: { type: String },
    slug: { type: String },
    wardValueName: { type: String },
    color: { type: String },
    model: { type: String },
    carNumber: { type: String },
    owner: { type: String },
    country: { type: String },
    sit: { type: Number },
    activeButton: { type: String },
    accessories: { type: String },
    registry: { type: String },
    numberBox: { type: String },
    status: { type: String },
    cityValueName: { type: String },
    districtValueName: { type: String },
    cityValue: { type: String },
    districtValue: { type: String },
    wardValue: { type: String },
    detailAddress: { type: String },
  },
  censorship: { type: Boolean || null },
});

const FormPostCheck = mongoose.model("FormPostCheck", formShema);

export default FormPostCheck;
