package controllers;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import com.mrpin.taxi.R;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class TaxiActivityMain extends Activity implements LocationListener, android.view.View.OnClickListener
{
    private static String URL_SERVER = "http://213.160.139.178:22080/srvprivat/";

    private LocationManager _locationManager;

    private WebView _webView;
//    private TextView _textView;
//    private Button _buttonGPS;

//    private float _rateDowntime;
//    private float _rateCity;

    /*
     * Properties
     */


    private boolean isGPSEnabled()
    {
        return _locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }

    private boolean isNetworkConnected()
    {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo ni = cm.getActiveNetworkInfo();
        return ni != null;
    }

    /**
     * Called when the activity is first created.
     */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        _locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);


//        _textView.setText(String.format("Cтоимость: %f", 15.0));
//        _textView = (TextView) findViewById(R.id.textView);
//        _buttonGPS = (Button) findViewById(R.id.buttonGPS);
//        _buttonGPS.setOnClickListener(this);

//        _rateDowntime = 15;
//        _rateCity = 26;
    }

    @Override
    public void onResume()
    {
        super.onResume();

        updateListener();

        _webView = new WebView(this);
        _webView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.FILL_PARENT, ViewGroup.LayoutParams.FILL_PARENT));
        this.addContentView(_webView, _webView.getLayoutParams());

        _webView.getSettings().setJavaScriptEnabled(true);
        _webView.loadUrl("file:///android_asset/index.html");

//        recreateWebView();

//        updateView();

//        updateListener();
    }

    public void onPause()
    {
        super.onPause();

//        _locationManager.removeUpdates(this);
    }


    private void setRate()
    {
//        String rateParams = String.format("{rate_downtime: %f, rate_city: %f}", _rateDowntime, _rateCity);
//        String jsCode = String.format("javascript:setRate(%s);", rateParams);
//        _webView.loadUrl(jsCode);
    }

    private void updateListener()
    {
        boolean isNetworkAvailable = isNetworkConnected();
        boolean isGPSAvailable = isGPSEnabled();

        if (!isNetworkAvailable || !isGPSAvailable)
        {
            _locationManager.removeUpdates(this);
        }
        else
        {
            List<String> providers = _locationManager.getProviders(false);

            for (String provider : providers)
            {
                _locationManager.requestLocationUpdates(provider, 0, 0.0f, this);
//                Location lastLocation = _locationManager.getLastKnownLocation(provider);

//                if (lastLocation != null)
//                {
//                    onLocationChanged(lastLocation);
//                }
            }
        }


    }

    private void updateView()
    {
//        boolean isNetworkAvailable = isNetworkConnected();
//        boolean isGPSAvailable = isGPSEnabled();

//        _webView.setVisibility((isGPSAvailable && isNetworkAvailable) ? View.VISIBLE : View.GONE);
//        _textView.setVisibility((isGPSAvailable && isNetworkAvailable) ? View.GONE : View.VISIBLE);
//        _buttonGPS.setVisibility(isGPSAvailable ? View.GONE : View.VISIBLE);

//        if (!isNetworkAvailable && !isGPSAvailable)
//        {
//            _textView.setText("Нет интернета. GPS disabled.");
//        }
//        else if (!isGPSAvailable)
//        {
//            _textView.setText("Активируйте GPS.");
//
//        }
//        else if (!isNetworkAvailable)
//        {
//            _textView.setText("Нет интернета.");
//        }
    }


    public void postData()
    {
        // Create a new HttpClient and Post Header
        HttpClient httpclient = new DefaultHttpClient();
        HttpPost httppost = new HttpPost("http://www.yoursite.com/script.php");

        try
        {
            // Add your data
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
            nameValuePairs.add(new BasicNameValuePair("id", "12345"));
            nameValuePairs.add(new BasicNameValuePair("stringdata", "AndDev is Cool!"));
            httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

            // Execute HTTP Post Request
            HttpResponse response = httpclient.execute(httppost);

        }
        catch (ClientProtocolException e)
        {
            // TODO Auto-generated catch block
        }
        catch (IOException e)
        {
            // TODO Auto-generated catch block
        }
    }

    /*
     * OnClickListener
     */

    @Override
    public void onClick(View view)
    {
//        if (view == _buttonGPS)
//        {
//            startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS));
//        }
    }
    /*
     * LocationListener
     */

    @Override
    public void onLocationChanged(Location location)
    {
        String locationParams = String.format("{latitude: %f, longitude: %f}", location.getLatitude(), location.getLongitude());

        String jsCode = String.format("javascript:updateLocation(%s);", locationParams);

        _webView.loadUrl(jsCode);
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle)
    {
        System.out.print("");
    }

    @Override
    public void onProviderEnabled(String s)
    {
        System.out.print("");

        List<String> providers = _locationManager.getProviders(true);

        for (String provider : providers)
        {
            Location lastLocation = _locationManager.getLastKnownLocation(provider);
            _locationManager.requestLocationUpdates(provider, 0, 0.0f, this);

            if (lastLocation != null)
            {
                onLocationChanged(lastLocation);
            }
        }
//        updateView();
    }

    @Override
    public void onProviderDisabled(String s)
    {
        System.out.print("");
//        updateView();
    }
}
