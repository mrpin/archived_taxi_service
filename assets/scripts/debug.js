/**
 * Created with JetBrains WebStorm.
 * User: aleksandrabelyaeva
 * Date: 10/12/13
 * Time: 4:11 PM
 * To change this template use File | Settings | File Templates.
 */
function assert(condition, message)
{
    if (!condition)
    {
        throw message || "Assertion failed";
    }
}