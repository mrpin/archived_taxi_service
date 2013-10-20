/**
 * Created with IntelliJ IDEA.
 * User: gregorytkach
 * Date: 10/19/13
 * Time: 9:08 AM
 * To change this template use File | Settings | File Templates.
 */
// First, checks if it isn't implemented yet.
if (!String.prototype.format)
{
    String.prototype.format = function ()
    {
        var args = arguments;
        return this.replace(/{(\d+)}/g,
            function (match, number)
            {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
    };
}