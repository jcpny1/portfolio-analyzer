class ApplicationController < ActionController::API
  def current_user
    @_current_user ||= User.find_by(id: 1)  # Hardcode user id until login logic is implemented.
  end
end
