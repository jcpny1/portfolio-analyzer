require "rails_helper"

RSpec.feature "Portfolio Management", js: true, :type => :feature do
  scenario "User creates a new portfolio" do
    visit 'http://127.0.0.1:3000'
    page.first('#portfolioPlus').click
    fill_in "Name", :with => "Portfolio X"
    click_button "Submit"
    expect(page).to have_text("Portfolio X")
  end
end
