using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using UnityEngine.Networking;

public class LoginStats : MonoBehaviour
{
    public string ProgramName = "测试程序";
    private string uuid = "uid";
    private void Awake()
    {
        QueryClientInfo();
    }
    private void QueryClientInfo()
    {
        string storeId = PlayerPrefs.GetString(uuid, "");
        if (string.IsNullOrEmpty(storeId))
        {
            storeId = Guid.NewGuid().ToString();
            PlayerPrefs.SetString(uuid, storeId);
        }
        RequestAuth(storeId);
    }

    private void RequestAuth(string clientID)
    {
        StartCoroutine(APIRequest(clientID));
    }

    private IEnumerator APIRequest(string clientID)
    {
        WWWForm form = new WWWForm();
        form.AddField("clientID", clientID);
        form.AddField("programName", ProgramName);
        UnityWebRequest req = UnityWebRequest.Post("https://5y5007l723.zicp.fun/api/clientLogin", form);
        yield return req.SendWebRequest();
        if (req.isNetworkError)
        {
            Debug.Log(req.error);
        }
        else
        {
            Debug.Log(req.downloadHandler.text);
        }
    }
}
