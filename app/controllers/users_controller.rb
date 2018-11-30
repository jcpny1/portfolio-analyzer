# This controller handles requests for User data.
class UsersController < ApplicationController
  before_action :user

  # Retrieve user settings.
  def show
    render json: @user
  end

  # Commit user edits to the database.
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors.full_messages, status: :unprocessable_entity
    end
  end

private

    # Load the user identified in the route.
    def user
      @user = User.find(current_user.id)
    end

    # Filter params for allowed attributes only.
    def user_params
      params.require(:user).permit(:locale)
    end
end
