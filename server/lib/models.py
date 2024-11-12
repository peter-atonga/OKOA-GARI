from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
from enum import Enum
metadata=MetaData()
db=SQLAlchemy(metadata=metadata)

class User(db.Model,SerializerMixin):
    __tablename__="users"

    id=db.Column(db.Integer,primary_key=True)
    email=db.Column(db.String, unique=True)
    password=db.Column(db.String,nullable=False)
    created_at=db.Column(db.DateTime)
    updated_at=db.Column(db.DateTime)
    #Relationships
    role=db.relationship("User_Role",back_populates="users")
    profile=db.relationship("Profile",back_populates="user")
    vehicles=db.relationship("Vehicle",back_populates="user")
    garage=db.relationship("Garage", back_populates="user")
    payments=db.relationship("Payment", back_populates="user")
    chats=db.relationship("User_Chat", back_populates="user")
    reviews=db.relationship("Review", back_populates='user')
    #serialize rules
    serialize_rules=("-password","-role.users",'-profile.user','-vehicles.user',"-garage.user",'-payments.user','-chats','-reviews.user')

class Role(db.Model,SerializerMixin):
    __tablename__="roles"
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String, nullable=False, unique=True)
    #Relationships
    users=db.relationship("User_Role", back_populates="role")
    #serialize rules
    serialize_rules=('-users.role',)

class User_Role(db.Model,SerializerMixin):
    __tablename__="user_roles"

    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'))
    role_id=db.Column(db.Integer,db.ForeignKey("roles.id"))
    #Relationships
    users=db.relationship("User",back_populates="role")
    role=db.relationship("Role",back_populates="users")
    #serialize rules
    serialize_rules=('-users',"-role")

class Profile(db.Model,SerializerMixin):
    __tablename__="profiles"

    id=db.Column(db.Integer, primary_key=True)
    first_name=db.Column(db.String, nullable=False)
    last_name=db.Column(db.String,nullable=False)
    created_at=db.Column(db.DateTime)
    user_id=db.Column(db.Integer, db.ForeignKey("users.id"))
    updated_at=db.Column(db.DateTime)
    location=db.Column(db.String)
    #Relationships
    user=db.relationship("User",back_populates="profile")

    #serialize rules
    serialize_rules=("-user",)

class TransmissionEnum(Enum):
    manual="Manual"
    automatic="Automatic"
class FuelTypeEnum(Enum):
    petrol="Petrol"
    diesel="Diesel"

class Vehicle(db.Model,SerializerMixin):
    __tablename__="vehicles"

    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String, nullable=False)
    model=db.Column(db.String, nullable=False)
    registration=db.Column(db.String, unique=True)
    user_id=db.Column(db.Integer,db.ForeignKey("users.id"))
    photo_url=db.Column(db.String)
    engine=db.Column(db.String, nullable=False)
    transmission=db.Column(db.Enum(TransmissionEnum))
    fuel_type=db.Column(db.Enum(FuelTypeEnum))
    created_at=db.Column(db.DateTime)
    updated_at=db.Column(db.DateTime)
    #relationships
    user=db.relationship("User",back_populates="vehicles")
    features=db.relationship("Vehicle_Feature", back_populates="vehicle")
    #serialise rules
    serialize_rules=("-user.vehicles","-features.vehicle")

class Vehicle_Feature(db.Model,SerializerMixin):
    __tablename__="vehicle_features"

    id=db.Column(db.Integer,primary_key=True)
    feature=db.Column(db.String)
    vehicle_id=db.Column(db.Integer,db.ForeignKey("vehicles.id"))
    created_at=db.Column(db.DateTime)
    updated_at=db.Column(db.DateTime)
    #relationships
    vehicle=db.relationship("Vehicle",back_populates="features")

    #serialise rules
    serialize_rules=("-vehicle")

class Garage(db.Model,SerializerMixin):
    __tablename__="garages"

    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String, unique=True)
    location=db.Column(db.String, nullable=False)
    contact=db.Column(db.Integer, unique=True)
    email=db.Column(db.String, unique=True)
    user_id=db.Column(db.Integer,db.ForeignKey("users.id"))
    description=db.Column(db.String)
    created_at=db.Column(db.DateTime, nullable=False)
    updated_at=db.Column(db.DateTime)
    #relationshps
    user=db.relationship("User",back_populates="garage")
    garage_products=db.relationship("Product",back_populates="garages")
    garage_services=db.relationship("Garage_Service", back_populates="garage")
    chats=db.relationship("User_Chat",back_populates="garage")
    #serialise rules
    serialize_rules=("-user",'-garage_products',"-garage_services.garage",'-chats.garage')

class Product(db.Model,SerializerMixin):
    __tablename__="products"

    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String, unique=True)
    garage_id=db.Column(db.Integer, db.ForeignKey("garages.id"))
    #relationships
    garages=db.relationship("Garage",back_populates="garage_products")

    #serialise rules
    serialize_rules=("-garages")

class Service_Type_Enum(Enum):
    towing="Towing"
    other="Other"

class Garage_Service(db.Model,SerializerMixin):
    __tablename__="garage_services"

    id=db.Column(db.Integer, primary_key=True)
    service=db.Column(db.String, nullable=False)
    service_type=db.Column(db.Enum(Service_Type_Enum))
    garage_id=db.Column(db.Integer,db.ForeignKey('garages.id'))
    created_at=db.Column(db.DateTime)
    updated_at=db.Column(db.DateTime)
    #relationships
    garage=db.relationship("Garage",back_populates="garage_services")
    details=db.relationship("Service_Detail", back_populates="service")
    payments=db.relationship("Payment", back_populates="service")
    service_price=db.relationship("Service_Pricing",back_populates="service")
    reviews=db.relationship("Review", back_populates="garage")
    #serialise rules
    serialize_rules=("-garage.garage_services", "-details",'-payments','-service_price','-reviews.garage')

class Service_Detail(db.Model,SerializerMixin):
    __tablename__="service_details"

    id=db.Column(db.Integer, primary_key=True)
    detail=db.Column(db.String,nullable=False)
    service_id=db.Column(db.Integer, db.ForeignKey("garage_services.id"))
    created_at=db.Column(db.DateTime)
    updated_at=db.Column(db.DateTime)
    #relationships
    service=db.relationship("Garage_Service",back_populates="details")

    #serialise rules
    serialize_rules=("-service.details",)

class Payment(db.Model,SerializerMixin):
    __tablename__="payments"

    id=db.Column(db.Integer,primary_key=True)
    service_id=db.Column(db.Integer,db.ForeignKey("garage_services.id"))
    user_id=db.Column(db.Integer, db.ForeignKey("users.id"))
    #relationships
    service=db.relationship("Garage_Service",back_populates="payments")
    user=db.relationship("User", back_populates="payments")
    #serialise rules
    serialize_rules=("-service",'-user')

class Service_Pricing(db.Model,SerializerMixin):
    __tablename__="pricings"

    id=db.Column(db.Integer,primary_key=True)
    amount=db.Column(db.Float, nullable=False)
    detail=db.Column(db.String)
    service_id=db.Column(db.Integer, db.ForeignKey("garage_services.id"))
    created_at=db.Column(db.DateTime)
    updated_at=db.Column(db.DateTime)
    #relationships
    service=db.relationship("Garage_Service",back_populates="service_price")
    #serialise rules
    serialize_rules=("-service",)

class Chat(db.Model,SerializerMixin):
    __tablename__="chats"

    id=db.Column(db.Integer, primary_key=True)
    message=db.Column(db.String, nullable=False)
    created_at=db.Column(db.DateTime)
    updated_at=db.Column(db.DateTime)
    #relationships
    userChat=db.relationship("User_Chat", back_populates="chat")
    #seralise rules
    serialize_rules=("-userChat.chat",)

class User_Chat(db.Model,SerializerMixin):
    __tablename__="user_chats"

    id=db.Column(db.Integer,primary_key=True)
    chat_id=db.Column(db.Integer, db.ForeignKey("chats.id"))
    user_id=db.Column(db.Integer, db.ForeignKey("users.id"))
    garage_id=db.Column(db.Integer,db.ForeignKey("garages.id"))
    #relationships
    chat=db.relationship("Chat",back_populates="userChat")
    user=db.relationship("User",back_populates="chats")
    garage=db.relationship("Garage",back_populates="chats")
    #serialise riles
    serialize_rules=('-chat.userChat','-user.chats','-garage.chats')

class Review_Type_Enum(Enum):
    complaint="Complaint"
    compliment="Compliment"
    other="Other"
    
class Review(db.Model,SerializerMixin):
    __tablename__="reviews"

    id=db.Column(db.Integer, primary_key=True)
    review=db.Column(db.String, nullable=False)
    service_id=db.Column(db.Integer, db.ForeignKey("garage_services.id"))
    user_id=db.Column(db.Integer, db.ForeignKey("users.id"))
    review_type=db.Column(db.Enum(Review_Type_Enum), nullable=False)
    created_at=db.Column(db.DateTime)
    updated_at=db.Column(db.DateTime)
    #relationships
    garage=db.relationship("Garage_Service",back_populates="reviews")
    user=db.relationship("User",back_populates="reviews")
    #serialise rules
    serialize_rules=('-garage','-user')