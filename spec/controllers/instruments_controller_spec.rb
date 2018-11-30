require 'rails_helper'

RSpec.describe InstrumentsController, type: :controller do
  describe "GET index" do
    it "returns an instrument" do
      request.accept = "application/json"
      get :index, { :params => { v: 'INTC' }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data'].length).to be > 0
      expect(pr['data'][0]['attributes']['name']).to eq('Intel Corporation')
    end
  end

  describe "GET symbology" do
    it "populates database with all instruments" do
      request.accept = "application/json"
      get :instrument_bulk_load, :format => :json
      expect(response).to be_successful
    end
  end

  describe "Run async worker" do
    it "populates database with all instruments" do
      Sidekiq::Testing.inline! do
        FeedWorker.perform_async('instrument_bulk_load')
      end
      Sidekiq::Testing.inline! do  # should execute 'skip' path since all instruments are already loaded.
        FeedWorker.perform_async('instrument_bulk_load')
      end
    end
  end
end
