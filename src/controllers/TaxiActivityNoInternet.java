package controllers;

import android.app.Activity;
import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;
import android.view.View;

/**
 * Created with IntelliJ IDEA.
 * User: gregorytkach
 * Date: 10/19/13
 * Time: 3:11 PM
 * To change this template use File | Settings | File Templates.
 */
public class TaxiActivityNoInternet extends Activity implements LocationListener, android.view.View.OnClickListener
{

    /*
     * LocationListener
     */

    @Override
    public void onLocationChanged(Location location)
    {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle)
    {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public void onProviderEnabled(String s)
    {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public void onProviderDisabled(String s)
    {
        //To change body of implemented methods use File | Settings | File Templates.
    }
    /*
     *  OnClickListener
     */

    @Override
    public void onClick(View view)
    {
        //To change body of implemented methods use File | Settings | File Templates.
    }
}

