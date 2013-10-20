package models;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

/**
 * Created with IntelliJ IDEA.
 * User: gregorytkach
 * Date: 10/19/13
 * Time: 3:13 PM
 * To change this template use File | Settings | File Templates.
 */
public class ProgramInfo
{

    /*
     * Singleton realization
     */
    private static ProgramInfo _instance;

    private ProgramInfo()
    {
    }

    public static ProgramInfo Instance()
    {
        if (_instance == null)
        {
            _instance = new ProgramInfo();
        }

        return _instance;
    }

    /*
     * Properties
     */




}
