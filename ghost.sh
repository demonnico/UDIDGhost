udid=$(/usr/libexec/PlistBuddy -c Print:UDID udid.plist)
name=$(/usr/libexec/PlistBuddy -c Print:SERIAL udid.plist)
profilename="HBTopic_dev"

ios devices:add $name=$udid
ios profiles:devices:add $profilename $name=$udid
rm -f $profilename.mobileprovision
ios profiles:download $profilename
