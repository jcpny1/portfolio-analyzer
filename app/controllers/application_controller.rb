class ApplicationController < ActionController::API
  def current_user
    # @_current_user ||= User.find_by(id: 1)  # Hardcode user id until login logic is implemented.
    @_current_user ||= User.first  # Hardcode user id until login logic is implemented.
  end
end
