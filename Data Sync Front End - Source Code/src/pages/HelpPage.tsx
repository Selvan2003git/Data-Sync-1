import React, { useState } from 'react';
import './HelpPage.css';

const HelpPage = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="help-page">
      <h1>Application Help Guide</h1>
      <p>Welcome to the help guide! This page provides detailed instructions on how to use the application effectively.</p>

      {/* Setting Configurations Section */}
      <section>
        <h2>1. Setting Configurations</h2>
        <p>You can configure the application by either uploading a JSON file or editing the data manually.</p>

        {/* Upload JSON Section */}
        <div className="dropdown">
          <h3 onClick={() => toggleSection('json')}>
            Uploading a JSON File {openSection === 'json' ? '▼' : '▶'}
          </h3>
          {openSection === 'json' && (
            <div className="dropdown-content">
              <p>To upload a JSON file:</p>
              <ol>
                <li>Click on the <b>"Download Sample Format"</b> button to download the json format and edit your data.</li>
                <li>Click on the <b>"Upload Configuration"</b> button in the configuration section.</li>
                <li>Select your JSON file from your system.</li>
                <li>Click <b>"Upload"</b> to apply the configurations.</li>
              </ol>
              <img
                src="/images/upload-json.png"
                alt="Uploading JSON Screenshot"
                className="help-screenshot"
              />
            </div>
          )}
        </div>

        {/* Manual Edit Section */}
        <div className="dropdown">
          <h3 onClick={() => toggleSection('manual')}>
            Changing Data Manually {openSection === 'manual' ? '▼' : '▶'}
          </h3>
          {openSection === 'manual' && (
            <div className="dropdown-content">
              <p>To change the configuration data manually:</p>
              <ol>
                <li>Click on the <b>"Queries"</b> tab and add queries mentioning the required details.</li>
                <li>Click on the <b>"Servers"</b> tab and add servers mentioning the required details.</li>
                <li>Click on the <b>"Settings"</b> tab and provide credentials and workspace details for the zoho analytics API and provide Sync timings.</li>
                <li>Update the fields as per your requirement.</li>
                <li>Click <b>"Save"</b> to apply the changes.</li>
              </ol>
              <img
                src="/images/queries.png"
                alt="Manual Configuration Image"
                className="help-screenshot"
              />
              <img
                src="/images/server.png"
                alt="Manual Configuration Image"
                className="help-screenshot"
              />
              <img
                src="/images/settings.png"
                alt="Manual Configuration Image"
                className="help-screenshot"
              />
            </div>
          )}
        </div>
      </section>

      {/* Syncing Data Section */}
      <section>
        <h2>2. Syncing the Data</h2>
        <p>
          Once you’ve set up your configurations, you can sync your data by clicking the <b>"Sync"</b> button. This will start the data synchronization process.
        </p>
        <p>As the sync progresses, you will receive real-time logs in the logs section below the sync button.</p>

        <div className="screenshot">
          <h3>Example: Logs During Sync</h3>
          <img
            src="/images/syncing.png"
            alt="Sync Logs Screenshot"
            className="help-screenshot"
          />
        </div>
      </section>

      {/* Add, Edit, Delete Queries Section */}
      <section>
        <h2>3. Add, Edit, Delete Queries</h2>
        <p>In this section, you will learn how to add, edit, and delete queries in the application.</p>

        {/* Add Query Section */}
        <div className="dropdown">
          <h3 onClick={() => toggleSection('add-query')}>
            Adding a Query {openSection === 'add-query' ? '▼' : '▶'}
          </h3>
          {openSection === 'add-query' && (
            <div className="dropdown-content">
              <p>To add a new query:</p>
              <ol>
                <li>Click on the <b>"Add Query"</b> button.</li>
                <li>Enter your SQL query in the text box.</li>
                <li>Click <b>"Save"</b> to store the query in the system.</li>
              </ol>
              <img
                src="/images/queries.png"
                alt="Add Query Image"
                className="help-screenshot"
              />
            </div>
          )}
        </div>

        {/* Edit Query Section */}
        <div className="dropdown">
          <h3 onClick={() => toggleSection('edit-query')}>
            Editing a Query {openSection === 'edit-query' ? '▼' : '▶'}
          </h3>
          {openSection === 'edit-query' && (
            <div className="dropdown-content">
              <p>To edit an existing query:</p>
              <ol>
                <li>Select the query you want to edit from the list of stored queries.</li>
                <li>Click the <b>"Edit"</b> button next to the query.</li>
                <li>Update the SQL query in the text box.</li>
                <li>Click <b>"Save"</b> to apply the changes.</li>
              </ol>
              <img
                src="/images/edit_query.png"
                alt="Edit Query Screenshot"
                className="help-screenshot"
              />
            </div>
          )}
        </div>

        {/* Delete Query Section */}
        <div className="dropdown">
          <h3 onClick={() => toggleSection('delete-query')}>
            Deleting a Query {openSection === 'delete-query' ? '▼' : '▶'}
          </h3>
          {openSection === 'delete-query' && (
            <div className="dropdown-content">
              <p>To delete a query:</p>
              <ol>
                <li>Select the query you want to delete from the list of stored queries.</li>
                <li>Click the <b>"Delete"</b> button next to the query.</li>
                <li>Confirm the deletion by clicking <b>"Yes"</b> in the confirmation dialog.</li>
                <li>Click on the <b>"Settings"</b> tab and provide credentials and workspace.</li>
                <li>The query will be permanently removed from the system.</li>
              </ol>
              <img
                src="/images/delete_query.png"
                alt="Delete Query Screenshot"
                className="help-screenshot"
              />
            </div>
          )}
        </div>
      </section>

      {/* Add, Edit, Delete Servers Section */}
      <section>
        <h2>4. Add, Edit, Delete Servers</h2>
        <p>In this section, you will learn how to manage the list of servers.</p>

        {/* Add Server Section */}
        <div className="dropdown">
          <h3 onClick={() => toggleSection('add-server')}>
            Adding a Server {openSection === 'add-server' ? '▼' : '▶'}
          </h3>
          {openSection === 'add-server' && (
            <div className="dropdown-content">
              <p>To add a new server:</p>
              <ol>
                <li>Click on the <b>"Add Server"</b> button.</li>
                <li>Fill in the required server details (e.g., name, address, authentication details).</li>
                <li>Click <b>"Save"</b> to add the server to the list.</li>
              </ol>
              <img
                src="/images/server.png"
                alt="Add Server Screenshot"
                className="help-screenshot"
              />
            </div>
          )}
        </div>

        {/* Edit Server Section */}
        <div className="dropdown">
          <h3 onClick={() => toggleSection('edit-server')}>
            Editing a Server {openSection === 'edit-server' ? '▼' : '▶'}
          </h3>
          {openSection === 'edit-server' && (
            <div className="dropdown-content">
              <p>To edit a server's details:</p>
              <ol>
                <li>Select the server you want to edit from the list.</li>
                <li>Click the <b>"Edit"</b> button next to the server.</li>
                <li>Update the server information.</li>
                <li>Click <b>"Save"</b> to apply the changes.</li>
              </ol>
              <img
                src="/images/edit-server.png"
                alt="Edit Server Screenshot"
                className="help-screenshot"
              />
            </div>
          )}
        </div>

        {/* Delete Server Section */}
        <div className="dropdown">
          <h3 onClick={() => toggleSection('delete-server')}>
            Deleting a Server {openSection === 'delete-server' ? '▼' : '▶'}
          </h3>
          {openSection === 'delete-server' && (
            <div className="dropdown-content">
              <p>To delete a server:</p>
              <ol>
                <li>Select the server you want to delete from the list.</li>
                <li>Click the <b>"Delete"</b> button next to the server.</li>
                <li>Confirm the deletion by clicking <b>"Yes"</b> in the confirmation dialog.</li>
                <li>The server will be permanently removed from the system.</li>
              </ol>
              <img
                src="/images/delete_server.png"
                alt="Delete Server Screenshot"
                className="help-screenshot"
              />
            </div>
          )}
        </div>
      </section>

      {/* Zoho Analytics Settings Section */}
      <section>
        <h2>5. Zoho Analytics Settings</h2>
        <p>Here you can configure your Zoho Analytics settings.</p>

        {/* Sync Frequency Section */}
        <div className="dropdown">
          <h3 onClick={() => toggleSection('sync-frequency')}>
            Setting Sync Frequency {openSection === 'sync-frequency' ? '▼' : '▶'}
          </h3>
          {openSection === 'sync-frequency' && (
            <div className="dropdown-content">
              <p>You can set the sync frequency for your data either in hours or days:</p>
              <ol>
                <li>Click on the <b>"Set Sync Frequency"</b> button.</li>
                <li>Choose either <b>hours</b> or <b>days</b> from the dropdown.</li>
                <li>Enter the desired sync interval (e.g., every 6 hours, every 2 days).</li>
                <li>Click <b>"Save"</b> to apply the new sync frequency.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Zoho Analytics Credentials Section */}
        <div className="dropdown">
          <h3 onClick={() => toggleSection('zoho-credentials')}>
            Providing Zoho Analytics Credentials {openSection === 'zoho-credentials' ? '▼' : '▶'}
          </h3>
          {openSection === 'zoho-credentials' && (
            <div className="dropdown-content">
              <p>To connect to Zoho Analytics, you need to provide your client credentials:</p>
              <ol>
                <li>Click on the <b>"Provide Credentials"</b> button.</li>
                <li>Enter your Zoho Analytics <b>Client ID</b>, <b>Client Secret</b>, and <b>Redirect URI</b>.</li>
                <li>Click <b>"Save"</b> to save your credentials.</li>
              </ol>
              <img
                src="/images/settings.png"
                alt="Zoho Analytics Credentials Screenshot"
                className="help-screenshot"
              />
            </div>
          )}
        </div>

        {/* Zoho Analytics Workspace Details Section */}
        <div className="dropdown">
          <h3 onClick={() => toggleSection('workspace-details')}>
            Providing Workspace Details {openSection === 'workspace-details' ? '▼' : '▶'}
          </h3>
          {openSection === 'workspace-details' && (
            <div className="dropdown-content">
              <p>Provide your Zoho Analytics workspace details:</p>
              <ol>
                <li>Enter the <b>"Workspace Id"</b>.</li>
                <li>Enter your <b>Organization ID</b> of your zoho analytics account.</li>
                <li>Click <b>"Save"</b> to apply the settings.</li>
              </ol>
    
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HelpPage;
