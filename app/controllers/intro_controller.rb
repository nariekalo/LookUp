class LookUp < Sinatra::Base

  # Match '/' and '/p/:page'
  get %r{/(p(/(?<page>\d*))?)?} do
    @page_partials = Dir.glob("app/views/partials/pages/*")
    @page_partials.each do |page_partial|
      page_partial.gsub!("app/views/", "").gsub!(".erb", "")
      puts page_partial
    end
    erb :index
  end

  get '/roofs/:id' do
    Roof.first(id: params[:id]).to_json
  end

  post '/roofs/new' do
    roof = Roof.create
    roof.params_parser(params)
    roof.to_json
  end

  post '/roofs/:id/geolocation' do
    @roof.params_parser(params)
    @roof.to_json
  end

end