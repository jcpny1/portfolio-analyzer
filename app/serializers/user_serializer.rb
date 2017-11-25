# This serializer describes the data to be sent for User requests.
class UserSerializer < ActiveModel::Serializer
  attributes :id, :locale
end
