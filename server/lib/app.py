
from models import db,Role,User_Role,User,User_Chat,Profile,Vehicle,Vehicle_Feature,Garage_Service,Service_Detail,Service_Pricing,Payment,Product,Review,Chat,Garage,TransmissionEnum,FuelTypeEnum,Service_Type_Enum
from flask_migrate import Migrate
from flask import Flask, request, make_response,jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager,create_access_token, create_refresh_token,jwt_required,get_jwt_identity
import secrets,datetime,os
from datetime import timedelta
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash,generate_password_hash

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] =secrets.token_hex(32)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)  
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)  


migrate = Migrate(app, db)

db.init_app(app)
api=Api(app)
jwt=JWTManager(app)


class Create_Get_Role(Resource):
    @jwt_required()
    def post(self):
        user_id=get_jwt_identity()
        if  user_id:
            data =request.get_json()
            role=data.get("name")
            if role:
                is_role=Role.query.filter_by(name=role).first()
                if is_role:
                    return make_response({"error":"Role already exists"},400)
                new_role=Role(name=role)
                db.session.add(new_role)
                db.session.commit()
                return make_response(new_role.to_dict(),201)
            return make_response({"error":"Invalid data entry"},400)
        return make_response({"error":"User session expired"},400)

    def get(self):
        roles=Role.query.all()
        return make_response([role.to_dict() for role in roles],200)
api.add_resource(Create_Get_Role,'/roles')

class Signup(Resource):
    def post(self):
        # gets user data and creates a profile for them and a user role/functionality
        data=request.get_json()
        email=data.get("email")
        first_name=data.get("first_name")
        last_name=data.get("last_name")
        password=data.get("password")
        role=data.get("role","Client")
        location=data.get("location")
        date=datetime.datetime.now()
        if "@" in email and len(first_name)>3 and len(last_name)>3 and password and location:
            user=User.query.filter_by(email=email).first()
            if user:
                return make_response({"error":"Email is already registered"},400)
            # create the user
            new_user=User(email=email,password=generate_password_hash(password),created_at=date)
            db.session.add(new_user)
            db.session.commit()
            # create user profile
            new_profile=Profile(first_name=first_name,last_name=last_name,created_at=date,user_id=new_user.id,location=location)
            db.session.add(new_profile)
            db.session.commit()
            #create user role
            is_role=Role.query.filter_by(name=role).first()
            user_role=User_Role(user_id=new_user.id,role_id=is_role.id)
            db.session.add(user_role)
            db.session.commit()
            return make_response(new_user.to_dict(),201)
        return make_response({"error":"Invalid data"},400)
api.add_resource(Signup,'/signup')

class Login(Resource):
    def post(self):
        data=request.get_json()
        email=data.get("email")
        password=data.get("password")
        if email and password:
            user=User.query.filter_by(email=email).first()
            if user:
                if check_password_hash(user.password,password):
                    access_token=create_access_token(identity=user.id)
                    refresh_token=create_refresh_token(identity=user.id)
                    return make_response({"access_token":access_token,"refresh_token":refresh_token,"user_data":user.to_dict()},201)
                return make_response({"error":"Wrong password"},400)
            return make_response({"error":"User doesnt  exist"},400)
        return make_response({"error":"Invalid data"},400)
api.add_resource(Login,'/login')

class User_By_Id(Resource):
    @jwt_required()
    def patch(self):
        user_id=get_jwt_identity()
        if user_id:
            user=User.query.filter_by(id=user_id).first()
            user_profile=Profile.query.filter_by(user_id=user_id).first()
            data=request.get_json()
            for attr in data:
                if attr!="password":
                    setattr(user_profile,attr,data.get(attr))
                    setattr(user_profile,"updated_at",datetime.datetime.now())
                    db.session.add(user_profile)
                    db.session.commit()
                    return make_response(user_profile.to_dict(),200)
                #updates password in the user table if it exists for update
                setattr(user,'password',generate_password_hash(data.get("password")))
                setattr(user,"updated_at",datetime.datetime.now())
                db.session.add(user)
                db.session.commit()
                return make_response(user.to_dict(),200)
        return make_response({"error":"User session expired"},412)
api.add_resource(User_By_Id,'/user')

class Create_Get_Garage(Resource):
    def get(self): #returns all the garages
        garages=Garage.query.all()
        return make_response([garage.to_dict() for garage in garages],200)
    
    @jwt_required()
    def post(self):#creates a new garage
        user_id=get_jwt_identity()
        if user_id:
            data=request.get_json()
            email=data.get("email")
            name=data.get("name")
            location=data.get("location")
            contact=data.get("contact")
            description=data.get("description")
            date=datetime.datetime.now()
            garages=Garage.query.all()
            garages=[item.to_dict() for item in garages]
            if len(garages)>0 and all(item.get("name")!=name and item.get("contact")!=contact and item.get("email")!=email for item in garages):
                garage=Garage(name=name,location=location,contact=contact,email=email,user_id=user_id,description=description,created_at=date)
                db.session.add(garage)
                db.session.commit()
                return make_response(garage.to_dict(),201)
            return make_response({"msg":"Data exists."},400)
        return make_response({"msg":"User session expired"},412)
api.add_resource(Create_Get_Garage,'/garage')

class Create_Get_Product(Resource):
    def get(self):
        products=Product.query.all()
        return make_response([product.to_dict() for product in products],200)
    
    @jwt_required()
    def post(self):
        user_id=get_jwt_identity()
        if user_id:
            data=request.get_json()
            name=data.get("name")
            garage=data.get("garage")
            product=Product.query.filter_by(name=name).first()
            is_garage=Garage.query.filter_by(name=garage).first()
            if not product:
                if is_garage:
                    new_product=Product(name=name,garage_id=garage.id)
                    db.session.add(new_product)
                    db.session.commit()
                    return make_response(new_product.to_dict(),201)
                return make_response({"msg":"Garage does not exist"},400)
            return make_response({"msg":"Product already exists"},400)
        else:
            return make_response({"msg":"User session expired"},412)
api.add_resource(Create_Get_Product,'/products')

class Product_By_Id(Resource):
    def get(self,id):
        product=Product.query.filter_by(id=id).first()
        if product:
            return make_response(product.to_dict(),200)
        return make_response({"msg":"Product not found"},400)
    
    @jwt_required()
    def patch(self,id):
        user_id=get_jwt_identity()
        if user_id:
            product=Product.query.filter_by(id=id).first()
            if product:
                data=request.get_json()
                for attr in data:
                    setattr(product,attr,data.get(attr))
                db.session.add(product)
                db.session.commit()
                return make_response(product.to_dict(),200)
            return make_response({"msg":"Product not found"},400)
        return make_response({"msg":"User session expired"},412)

    @jwt_required()
    def delete(self,id):
        user_id=get_jwt_identity()
        if user_id:
            product=Product.query.filter_by(id=id).first()
            if product:
                db.session.delete(product)
                db.session.commit()
                return make_response({"msg":"Product deleted successfully"},204)
            return make_response({"msg":"Product not found"},400)
        return make_response({"msg":"User session expired"},412)
api.add_resource(Product_By_Id,'/product/<int:id>')

class Create_Chat(Resource):
    @jwt_required()
    def post(self):
        user_id=get_jwt_identity()
        if user_id:
            data=request.get_json()
            message=data.get("message")
            date=datetime.datetime.now()
            new_chat=Chat(message=message,created_at=date)
            db.session.add(new_chat)
            db.session.commit()
            return make_response(new_chat.to_dict(),201)
        return make_response({"msg":"User session expired"},412)
api.add_resource(Create_Chat,'/chats')

class Create_User_Chat(Resource):
    @jwt_required()
    def post(self):
        user_id=get_jwt_identity()
        if user_id:
            data=request.get_json()
            chat_id=data.get("chat_id")
            garage_id=data.get("garage_id")
            if chat_id and garage_id:
                new_user_chat=User_Chat(chat_id=chat_id, garage_id=garage_id,user_id=user_id)
                db.session.add(new_user_chat)
                db.session.commit()
                return make_response(new_user_chat.to_dict(),201)
            return make_response({"msg":"Invalid data"},400)
        return make_response({"msg":"User session expired"},412)
api.add_resource(Create_User_Chat,'/user-chat')

class Create_Get_Vehicles(Resource):
    @jwt_required()
    def get(self):
        user_id=get_jwt_identity()
        if user_id:
            vehicles=Vehicle.query.all()
            return make_response([vehicle.to_dict() for vehicle in vehicles],200)
        return make_response({"msg":"User session expired"},412)

    @jwt_required()
    def post(self):
        user_id=get_jwt_identity()
        if user_id:
            data=request.get_json()
            if 'name' in data and 'model' in data and 'registration' in data and 'engine' in data and 'transmission' in data and 'fuel_type' in data:
                vehicle=Vehicle.query.filter_by(registration=data.get("registration")).first()
                if vehicle:
                    return make_response({"msg":f"Vehicle registration {data.get("registration")} is already egistered"},400)
                if data.get("transmission") in ["Manual","Automatic"]:
                    if data.get("fuel_type") in ["Petrol","Diesel"]:
                        new_vehicle=Vehicle(
                            name=data.get("name"),model=data.get("model"),registration=data.get("registration"),
                            user_id=user_id,photo_url=data.get("photo_url"),engine=data.get("engine"),
                            transmission=TransmissionEnum(data.get("transmission")),created_at=datetime.datetime.now(),
                            fuel_type=FuelTypeEnum(data.get("fuel_type"))
                        )
                        db.session.add(new_vehicle)
                        db.session.commit()
                        return make_response(new_vehicle.to_dict(),201)
                    return make_response({"msg":"Fuel type must be Petrol or Diesel"},400)
                return make_response({"msg":"transmission type must be Manual or Automatic"},400)
            return make_response({"msg":"Required data is missing"},400)
        return make_response({"msg":"User session expired"},412)
api.add_resource(Create_Get_Vehicles,'/vehicles')

class Vehicle_By_Id(Resource):
    @jwt_required()
    def get(self,id):
        user_id=get_jwt_identity()
        if user_id:
            vehicle=Vehicle.query.filter_by(id=id).first()
            if vehicle:
                return make_response(vehicle.to_dict(),200)
            return make_response({"msg":"Vehicle not found"},400)
        return make_response({"msg":"User session expired"},412)

    @jwt_required()
    def delete(self,id):
        user_id=get_jwt_identity()
        if user_id:
            vehicle=Vehicle.query.filter_by(id=id).first()
            if vehicle:
                db.session.delete(vehicle)
                db.session.commit()
                return make_response({"msg":"Vehicle deleted successfully"},204)
            return make_response({"msg":"Vehicle not found"},400)
        return make_response({"msg":"User session expired"},412)

    @jwt_required()
    def patch(self,id):
        user_id=get_jwt_identity()
        if user_id:
            vehicle=Vehicle.query.filter_by(id=id).first()
            if vehicle:
                data=request.get_json()
                for attr in data:
                    setattr(vehicle,attr,data.get(attr))
                setattr(vehicle,"updated_at",datetime.datetime.now())
                db.session.add(vehicle)
                db.session.commit()
                return make_response(vehicle.to_dict(),200)
            return make_response({"msg":"Vehicle not found"},400)
        return make_response({"msg":"User session expired"},412)
api.add_resource(Vehicle_By_Id,'/vehicle/<int:id>')

class Create_Feature(Resource):
    @jwt_required()
    def post(self):
        #add a vehicle feature by identifying a vehicle through its registration
        user_id=get_jwt_identity()
        if user_id:
            data=request.get_json()
            if "feature" in data and 'registration' in data:
                vehicle=Vehicle.query.filter_by(registration=data.get("registration")).first()
                if vehicle:
                    new_feature=Vehicle_Feature(feature=data.get("feature"),vehicle_id=vehicle.id,
                                                created_at=datetime.datetime.now())
                    db.session.add(new_feature)
                    db.session.commit()
                    return make_response(new_feature.to_dict(),201)
                return make_response({"msg":"Vehicle not found"},400)
            return make_response({"msg":"Required data is missing"},400)
        return make_response({"msg":"User session expired"},412)
api.add_resource(Create_Feature,'/features')

class Feature_By_Id(Resource):
    @jwt_required()
    def delete(self,id):
        user_id=get_jwt_identity()
        if user_id:
            feature=Vehicle_Feature.query.filter_by(id=id).first()
            if feature:
                db.session.delete(feature)
                db.session.commit()
                return make_response({"msg":"Feature deleted successfully"},204)
            return make_response({"msg":"Feature does not exist"},400)
        return make_response({"msg":"User session expired"},412)
    
    @jwt_required()
    def patch(self,id):
        user_id=get_jwt_identity()
        if user_id:
            feature=Vehicle_Feature.query.filter_by(id=id).first()
            if feature:
                data=request.get_json()
                for attr in data:
                    setattr(feature,attr,data.get(attr))
                setattr(feature,"updated_at",datetime.datetime.now())
                db.session.add(feature)
                db.session.commit()
                return make_response(feature.to_dict(),200)
            return make_response({"msg":"Feature not found"},400)
        return make_response({"msg":"User session expired"},400)
api.add_resource(Feature_By_Id,'/feature/<int:id>')

class Create_Garage_Service(Resource):
    @jwt_required()
    def get(self):
        services=Garage_Service.query.all()
        return make_response([service.to_dict() for service in services],200)
    
    @jwt_required()
    def post(self):
        #creates a garage service and updates its details/description and proceeds to update pricing about the service
        user_id=get_jwt_identity()
        if user_id:
            data=request.get_json()
            if 'service' in data and 'service_type' in data and 'garage_id' in data and 'detail' in data and "amount" in data and 'pricing_detail' in data:
                if data.get("service_type") in ['Towing',"Other"]:
                    new_garage_service=Garage_Service(service=data.get("service"),service_type=Service_Type_Enum(data.get("service_type")),
                                                      garage_id=data.get("garage_id"),created_at=datetime.datetime.now())
                    db.session.add(new_garage_service)
                    db.session.commit()
                    # proceed to update details of the service
                    service_detail=Service_Detail(detail=data.get("detail"),
                                                  service_id=new_garage_service.id,
                                                  created_at=datetime.datetime.now())
                    db.session.add(service_detail)
                    db.session.commit()
                    #proceed to add payment details/amount about the service
                    service_price=Service_Pricing(amount=data.get("amount"), detail=data.get("pricing_detail"),
                                                  service_id=new_garage_service.id,created_at=datetime.datetime.now())
                    db.session.add(service_price)
                    db.session.commit()
                    return make_response(new_garage_service.to_dict(),201)
                return make_response({"msg":"Service type must be Towing or Other"})
            return make_response({"msg":"Required data is missing"},400)
        return make_response({"msg":"User session expired"},412)
api.add_resource(Create_Garage_Service,'/garage-service')

class Garage_Service_By_Id(Resource):
    @jwt_required()
    def get(self,id):
        service=Garage_Service.query.filter_by(id=id).first()
        if service:
            return make_response(service.to_dict(),200)
        return make_response({"msg":"Service does not exist"},400)
    
    @jwt_required()
    def delete(self,id):
        service=Garage_Service.query.filter_by(id=id).frist()
        if service:
            db.session.delete(service)
            db.session.commit()
            return make_response({"msg":"Service deleted successfully"},204)
        return make_response({"msg":"Service not found"},400)
    
    @jwt_required()
    def patch(self,id):
        service=Garage_Service.query.filter_by(id=id).first()
        if service:
            data=request.get_json()
            # update garage service details
            for item in ['service','service_type',"garage_id"]:
                if item in data:
                    setattr(service,item,data.get(item))
            db.session.add(service)
            db.session.commit()
            #update details of the service
            service_detail=Service_Detail.query.filter_by(service_id=service.id).first()
            if 'detail' in data:
                setattr(service_detail,"detail",data.get("detail"))
                setattr(service_detail,"updated_at",datetime.datetime.now())
            db.session.add(service_detail)
            db.session.commit()
            #update service details and/or pricing
            service_pricing=Service_Pricing.query.filter_by(service_id=service.id).first()
            for item in ['amount','pricing_detail']:
                if item in data:
                    setattr(service_pricing,item,data.get(item))
            setattr(service_pricing,"updated_at",datetime.datetime.now())
            db.session.add(service_pricing)
            db.session.commit()
            return make_response(service.to_dict(),200)
        return make_response({"msg":"Service not found"},400)
api.add_resource(Garage_Service_By_Id,'/service/<int:id>')

class Create_Get_Payment(Resource):
    @jwt_required()
    def get(self): #get all payments
        user_id=get_jwt_identity()
        if user_id:
            payments=Payment.query.all()
            return make_response([payment.to_dict() for payment in payments],200)
        return make_response({"msg":"User session expired"},412)
    
    @jwt_required()
    def post(self): #creates a new payment record
        user_id=get_jwt_identity()
        if user_id:
            data=request.get_json()
            if "service_id" in data:
                new_payment=Payment(service_id=data.get("service_id"),user_id=user_id)
                db.session.add(new_payment)
                db.session.commit()
                return make_response(new_payment.to_dict(),201)
            return make_response({"msg":"Required data missing"},400)
        return make_response({"msg":"User session expired"},412)
api.add_resource(Create_Get_Payment,'/payments')

class Payment_By_Id(Resource):
    @jwt_required()
    def get(self,id):
        user_id=get_jwt_identity()
        if user_id:
            payment=Payment.query.filter_by(id=id).first()
            if payment:
                return make_response(payment.to_dict(),200)
            return make_response({"msg":"Payment not found"},400)
        return make_response({"msg":"User session expired"},412)
    
    @jwt_required()
    def delete(self,id):
        user_id=get_jwt_identity()
        if user_id:
            payment=Payment.query.filter_by(id=id).first()
            if payment:
                db.session.delete(payment)
                db.session.commit()
                return make_response({"msg":"Payment deleted successfully"},204)
            return make_response({"msg":"Payment not found"},400)
        return make_response({"msg":"User session expired"},412)
    
    @jwt_required()
    def patch(self,id):
        payment=Payment.query.filter_by(id=id).first()
        if payment:
            data=request.get_json()
            if "service_id" in data:
                setattr(payment,"service_id",data.get("service_id"))
            db.session.add(payment)
            db.session.commit()
            return make_response(payment.to_dict(),200)
        return make_response({"msg":"Payment not found"},400)
api.add_resource(Payment_By_Id,'/payment/<int:id>')


if __name__=="__main__":
    app.run(debug=True)