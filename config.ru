use Rack::Auth::Basic, "Restricted Area" do |username, password|
  [username, password] == ['admin', 'admin']
end

use Rack::Static, 
  :urls => [""],
  :root => "dist"

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'dist, max-age=86400' 
    },
    File.open('dist/index.html', File::RDONLY)
  ]
}